-- ATS Resume Score Database Schema & Functions
-- Authors: Antigravity Pair Programmer

-- 1. Languages Table (Auxiliary Resume Section)
CREATE TABLE IF NOT EXISTS public.resume_languages (
    language_id BIGSERIAL PRIMARY KEY,
    resume_id BIGINT NOT NULL REFERENCES public.resume_master(resume_id) ON DELETE CASCADE,
    language_name CHARACTER VARYING NOT NULL,
    proficiency CHARACTER VARYING, -- Native, Professional, Conversational, etc.
    created_on TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP WITHOUT TIME ZONE,
    record_status SMALLINT DEFAULT 1
);

-- 2. ATS Keywords Master Table
CREATE TABLE IF NOT EXISTS public.ats_keywords (
    keyword_id SERIAL PRIMARY KEY,
    job_role CHARACTER VARYING NOT NULL,
    keyword CHARACTER VARYING NOT NULL,
    priority CHARACTER VARYING NOT NULL, -- High, Medium, Low
    is_required BOOLEAN DEFAULT FALSE
);

-- 3. ATS Score Master Table
CREATE TABLE IF NOT EXISTS public.ats_score_master (
    ats_score_id BIGSERIAL PRIMARY KEY,
    resume_id BIGINT NOT NULL REFERENCES public.resume_master(resume_id) ON DELETE CASCADE,
    overall_score INT NOT NULL,
    contact_information INT NOT NULL,
    summary INT NOT NULL,
    skills INT NOT NULL,
    projects INT NOT NULL,
    experience INT NOT NULL,
    education INT NOT NULL,
    certifications INT NOT NULL,
    languages INT NOT NULL,
    keyword_match INT NOT NULL,
    formatting INT NOT NULL,
    created_on TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index to optimize resume scoring lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_ats_score_master_resume_id ON public.ats_score_master(resume_id);

-- 4. ATS Score Details Table (Audit Trail)
CREATE TABLE IF NOT EXISTS public.ats_score_details (
    detail_id BIGSERIAL PRIMARY KEY,
    ats_score_id BIGINT NOT NULL REFERENCES public.ats_score_master(ats_score_id) ON DELETE CASCADE,
    section_name CHARACTER VARYING NOT NULL,
    score INT NOT NULL,
    comments TEXT
);

-- 5. ATS Resume Reports Table (Download History & Export)
CREATE TABLE IF NOT EXISTS public.ats_resume_reports (
    report_id BIGSERIAL PRIMARY KEY,
    resume_id BIGINT NOT NULL REFERENCES public.resume_master(resume_id) ON DELETE CASCADE,
    ats_score_id BIGINT NOT NULL REFERENCES public.ats_score_master(ats_score_id) ON DELETE CASCADE,
    report_data JSONB NOT NULL,
    downloaded_on TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. ATS Rules Table
CREATE TABLE IF NOT EXISTS public.ats_rules (
    rule_id SERIAL PRIMARY KEY,
    rule_name CHARACTER VARYING UNIQUE NOT NULL,
    rule_value NUMERIC NOT NULL,
    description TEXT
);

-- Seeding Default Scoring Weights & Requirements
INSERT INTO public.ats_rules (rule_name, rule_value, description)
VALUES 
('weight_contact', 10.0, 'Weight percentage for Contact Information in Overall Score'),
('weight_summary', 10.0, 'Weight percentage for Summary in Overall Score'),
('weight_skills', 15.0, 'Weight percentage for Skills Section in Overall Score'),
('weight_projects', 15.0, 'Weight percentage for Projects Section in Overall Score'),
('weight_experience', 15.0, 'Weight percentage for Work Experience Section in Overall Score'),
('weight_education', 10.0, 'Weight percentage for Education Section in Overall Score'),
('weight_certifications', 5.0, 'Weight percentage for Certifications in Overall Score'),
('weight_languages', 5.0, 'Weight percentage for Languages in Overall Score'),
('weight_keyword_match', 10.0, 'Weight percentage for Keyword Match in Overall Score'),
('weight_formatting', 5.0, 'Weight percentage for Formatting Score in Overall Score'),
('min_skills_count', 8.0, 'Minimum skills count required for full skills score'),
('min_projects_count', 2.0, 'Minimum projects count required for full projects score')
ON CONFLICT (rule_name) DO UPDATE SET rule_value = EXCLUDED.rule_value;

-- Seeding Default ATS Keywords
DELETE FROM public.ats_keywords;
INSERT INTO public.ats_keywords (job_role, keyword, priority, is_required)
VALUES
-- SQL / Database Developer Role
('SQL Developer', 'PostgreSQL', 'High', TRUE),
('SQL Developer', 'PL/pgSQL', 'High', TRUE),
('SQL Developer', 'SQL Optimization', 'High', FALSE),
('SQL Developer', 'JSON', 'Medium', FALSE),
('SQL Developer', 'Views', 'Medium', FALSE),
('SQL Developer', 'CTE', 'High', FALSE),
('SQL Developer', 'Stored Procedures', 'High', TRUE),
('SQL Developer', 'Database Design', 'High', TRUE),
('SQL Developer', 'Performance Tuning', 'High', FALSE),
('SQL Developer', 'Joins', 'Medium', FALSE),
('SQL Developer', 'Indexes', 'Medium', FALSE),
('SQL Developer', 'Data Modeling', 'Medium', FALSE),
('SQL Developer', 'Database', 'Low', FALSE),
('SQL Developer', 'Query Optimization', 'High', FALSE),

-- Software Engineer Role
('Software Engineer', 'JavaScript', 'High', TRUE),
('Software Engineer', 'HTML', 'Medium', FALSE),
('Software Engineer', 'CSS', 'Medium', FALSE),
('Software Engineer', 'React', 'High', FALSE),
('Software Engineer', 'Node.js', 'High', TRUE),
('Software Engineer', 'REST API', 'High', TRUE),
('Software Engineer', 'Git', 'Medium', FALSE),
('Software Engineer', 'Docker', 'High', FALSE),
('Software Engineer', 'CI/CD', 'Medium', FALSE),
('Software Engineer', 'Python', 'Medium', FALSE),
('Software Engineer', 'TypeScript', 'High', FALSE),
('Software Engineer', 'Agile', 'Low', FALSE),

-- Fullstack Developer Role
('Fullstack Developer', 'React', 'High', TRUE),
('Fullstack Developer', 'Node.js', 'High', TRUE),
('Fullstack Developer', 'Express', 'Medium', FALSE),
('Fullstack Developer', 'JavaScript', 'High', TRUE),
('Fullstack Developer', 'HTML', 'Medium', FALSE),
('Fullstack Developer', 'CSS', 'Medium', FALSE),
('Fullstack Developer', 'PostgreSQL', 'Medium', FALSE),
('Fullstack Developer', 'MongoDB', 'Medium', FALSE),
('Fullstack Developer', 'Git', 'Medium', FALSE),
('Fullstack Developer', 'REST API', 'High', TRUE);

----------------------------------------------------------------------------------
-- PostgreSQL Helper Function: Match Job Role from Resume
----------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fn_detect_resume_role(p_resume_id bigint)
RETURNS CHARACTER VARYING AS $$
DECLARE
    v_role CHARACTER VARYING := 'SQL Developer'; -- Default role
    v_title CHARACTER VARYING;
BEGIN
    -- 1. Try to fetch from active/latest experience job title
    SELECT job_title INTO v_title
    FROM public.resume_experience
    WHERE resume_id = p_resume_id AND record_status = 1
    ORDER BY currently_working DESC, COALESCE(end_date, '9999-12-31'::date) DESC, start_date DESC
    LIMIT 1;

    -- 2. Try to fetch from resume master title if experience not found
    IF v_title IS NULL OR v_title = '' THEN
        SELECT resume_title INTO v_title
        FROM public.resume_master
        WHERE resume_id = p_resume_id AND record_status = 1;
    END IF;

    -- 3. Match against known roles
    IF v_title IS NOT NULL THEN
        IF v_title ILIKE '%full%stack%' OR v_title ILIKE '%web%dev%' THEN
            v_role := 'Fullstack Developer';
        ELSIF v_title ILIKE '%software%eng%' OR v_title ILIKE '%developer%' OR v_title ILIKE '%programmer%' THEN
            v_role := 'Software Engineer';
        ELSIF v_title ILIKE '%sql%' OR v_title ILIKE '%db%' OR v_title ILIKE '%database%' OR v_title ILIKE '%postgres%' THEN
            v_role := 'SQL Developer';
        END IF;
    END IF;

    RETURN v_role;
END;
$$ LANGUAGE plpgsql;

----------------------------------------------------------------------------------
-- PostgreSQL Function: get_keyword_matches
----------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_keyword_matches(p_resume_id bigint)
RETURNS json AS $$
DECLARE
    v_role CHARACTER VARYING;
    v_matches json;
BEGIN
    v_role := public.fn_detect_resume_role(p_resume_id);
    
    WITH matched_keys AS (
        SELECT DISTINCT k.keyword, k.priority, k.is_required
        FROM public.ats_keywords k
        LEFT JOIN public.resume_skills s ON s.resume_id = p_resume_id AND s.record_status = 1 AND s.skill_name ILIKE '%' || k.keyword || '%'
        LEFT JOIN public.resume_projects p ON p.resume_id = p_resume_id AND p.record_status = 1 AND (p.project_name ILIKE '%' || k.keyword || '%' OR p.project_description ILIKE '%' || k.keyword || '%' OR p.technologies_used ILIKE '%' || k.keyword || '%')
        LEFT JOIN public.resume_personal pers ON pers.resume_id = p_resume_id AND pers.record_status = 1 AND pers.professional_summary ILIKE '%' || k.keyword || '%'
        LEFT JOIN public.resume_experience exp ON exp.resume_id = p_resume_id AND exp.record_status = 1 AND (exp.job_title ILIKE '%' || k.keyword || '%' OR exp.job_description ILIKE '%' || k.keyword || '%')
        WHERE k.job_role = v_role AND (
            s.skill_id IS NOT NULL OR 
            p.project_id IS NOT NULL OR 
            pers.resume_personal_id IS NOT NULL OR 
            exp.experience_id IS NOT NULL
        )
    )
    SELECT COALESCE(json_agg(row_to_json(matched_keys)), '[]'::json) INTO v_matches FROM matched_keys;

    RETURN v_matches;
END;
$$ LANGUAGE plpgsql;

----------------------------------------------------------------------------------
-- PostgreSQL Function: get_missing_keywords
----------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_missing_keywords(p_resume_id bigint)
RETURNS json AS $$
DECLARE
    v_role CHARACTER VARYING;
    v_missing json;
BEGIN
    v_role := public.fn_detect_resume_role(p_resume_id);

    WITH missing_keys AS (
        SELECT DISTINCT k.keyword, k.priority, k.is_required
        FROM public.ats_keywords k
        WHERE k.job_role = v_role AND k.keyword NOT IN (
            SELECT DISTINCT k2.keyword
            FROM public.ats_keywords k2
            LEFT JOIN public.resume_skills s ON s.resume_id = p_resume_id AND s.record_status = 1 AND s.skill_name ILIKE '%' || k2.keyword || '%'
            LEFT JOIN public.resume_projects p ON p.resume_id = p_resume_id AND p.record_status = 1 AND (p.project_name ILIKE '%' || k2.keyword || '%' OR p.project_description ILIKE '%' || k2.keyword || '%' OR p.technologies_used ILIKE '%' || k2.keyword || '%')
            LEFT JOIN public.resume_personal pers ON pers.resume_id = p_resume_id AND pers.record_status = 1 AND pers.professional_summary ILIKE '%' || k2.keyword || '%'
            LEFT JOIN public.resume_experience exp ON exp.resume_id = p_resume_id AND exp.record_status = 1 AND (exp.job_title ILIKE '%' || k2.keyword || '%' OR exp.job_description ILIKE '%' || k2.keyword || '%')
            WHERE k2.job_role = v_role AND (
                s.skill_id IS NOT NULL OR 
                p.project_id IS NOT NULL OR 
                pers.resume_personal_id IS NOT NULL OR 
                exp.experience_id IS NOT NULL
            )
        )
    )
    SELECT COALESCE(json_agg(row_to_json(missing_keys)), '[]'::json) INTO v_missing FROM missing_keys;

    RETURN v_missing;
END;
$$ LANGUAGE plpgsql;

----------------------------------------------------------------------------------
-- PostgreSQL Function: get_resume_suggestions
----------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_resume_suggestions(p_resume_id bigint)
RETURNS json AS $$
DECLARE
    v_suggestions jsonb := '[]'::jsonb;
    v_personal_summary text;
    v_skills_count int;
    v_projects_count int;
    v_certifications_count int;
    v_linkedin_url CHARACTER VARYING;
    v_experience_count int;
    v_languages_count int;
    v_resume_json jsonb;
BEGIN
    -- Fetch details
    SELECT professional_summary, linkedin_url INTO v_personal_summary, v_linkedin_url
    FROM public.resume_personal
    WHERE resume_id = p_resume_id AND record_status = 1
    LIMIT 1;

    SELECT COUNT(*) INTO v_skills_count FROM public.resume_skills WHERE resume_id = p_resume_id AND record_status = 1;
    SELECT COUNT(*) INTO v_projects_count FROM public.resume_projects WHERE resume_id = p_resume_id AND record_status = 1;
    SELECT COUNT(*) INTO v_certifications_count FROM public.resume_certifications WHERE resume_id = p_resume_id AND record_status = 1;
    SELECT COUNT(*) INTO v_experience_count FROM public.resume_experience WHERE resume_id = p_resume_id AND record_status = 1;

    -- Languages check from DB and resume_json
    SELECT COUNT(*) INTO v_languages_count FROM public.resume_languages WHERE resume_id = p_resume_id AND record_status = 1;
    IF v_languages_count = 0 THEN
        SELECT resume_json INTO v_resume_json FROM public.resume_master WHERE resume_id = p_resume_id AND record_status = 1;
        IF v_resume_json IS NOT NULL AND jsonb_typeof(v_resume_json->'languages') = 'array' THEN
            v_languages_count := jsonb_array_length(v_resume_json->'languages');
        END IF;
    END IF;

    -- Evaluate rules
    IF v_personal_summary IS NULL OR TRIM(v_personal_summary) = '' THEN
        v_suggestions := v_suggestions || jsonb_build_array('Add a professional summary.');
    END IF;

    IF v_skills_count < 8 THEN
        v_suggestions := v_suggestions || jsonb_build_array('Add more technical skills.');
    END IF;

    IF v_projects_count = 0 THEN
        v_suggestions := v_suggestions || jsonb_build_array('Include at least two projects.');
    ELSIF v_projects_count < 2 THEN
        v_suggestions := v_suggestions || jsonb_build_array('Include at least one more project to demonstrate hands-on experience.');
    END IF;

    IF v_certifications_count = 0 THEN
        v_suggestions := v_suggestions || jsonb_build_array('Add certifications.');
    END IF;

    IF v_linkedin_url IS NULL OR TRIM(v_linkedin_url) = '' OR v_linkedin_url NOT ILIKE '%linkedin.com%' THEN
        v_suggestions := v_suggestions || jsonb_build_array('Add LinkedIn profile.');
    END IF;

    IF v_experience_count = 0 THEN
        v_suggestions := v_suggestions || jsonb_build_array('Add work experience to showcase your professional background.');
    END IF;

    IF v_languages_count = 0 THEN
        v_suggestions := v_suggestions || jsonb_build_array('Add languages to display your linguistic abilities.');
    END IF;

    -- Extra formatting suggestions if needed
    v_suggestions := v_suggestions || jsonb_build_array('Increase measurable achievements in your experience section.');
    v_suggestions := v_suggestions || jsonb_build_array('Use standard section headings.');
    v_suggestions := v_suggestions || jsonb_build_array('Remove tables and text boxes.');
    v_suggestions := v_suggestions || jsonb_build_array('Use a professional font (e.g. Inter or Outfit).');

    RETURN v_suggestions::json;
END;
$$ LANGUAGE plpgsql;

----------------------------------------------------------------------------------
-- PostgreSQL Function: get_resume_sections_status
----------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_resume_sections_status(p_resume_id bigint)
RETURNS json AS $$
DECLARE
    v_personal_exists boolean := FALSE;
    v_summary_exists boolean := FALSE;
    v_skills_exists boolean := FALSE;
    v_projects_exists boolean := FALSE;
    v_experience_exists boolean := FALSE;
    v_education_exists boolean := FALSE;
    v_certifications_exists boolean := FALSE;
    v_languages_exists boolean := FALSE;
    v_summary text;
    v_linkedin_url CHARACTER VARYING;
    v_email CHARACTER VARYING;
    v_mobile CHARACTER VARYING;
    v_completed_count int := 0;
    v_percentage int;
    v_sections jsonb := '[]'::jsonb;
    v_resume_json jsonb;
    v_languages_count int := 0;
BEGIN
    -- Check contact
    SELECT (email IS NOT NULL AND TRIM(email) <> '' AND mobile IS NOT NULL AND TRIM(mobile) <> ''), professional_summary 
    INTO v_personal_exists, v_summary
    FROM public.resume_personal
    WHERE resume_id = p_resume_id AND record_status = 1
    LIMIT 1;

    v_personal_exists := COALESCE(v_personal_exists, FALSE);
    IF v_summary IS NOT NULL AND TRIM(v_summary) <> '' THEN
        v_summary_exists := TRUE;
    END IF;

    -- Check child tables
    SELECT EXISTS(SELECT 1 FROM public.resume_skills WHERE resume_id = p_resume_id AND record_status = 1) INTO v_skills_exists;
    SELECT EXISTS(SELECT 1 FROM public.resume_projects WHERE resume_id = p_resume_id AND record_status = 1) INTO v_projects_exists;
    SELECT EXISTS(SELECT 1 FROM public.resume_experience WHERE resume_id = p_resume_id AND record_status = 1) INTO v_experience_exists;
    SELECT EXISTS(SELECT 1 FROM public.resume_education WHERE resume_id = p_resume_id AND record_status = 1) INTO v_education_exists;
    SELECT EXISTS(SELECT 1 FROM public.resume_certifications WHERE resume_id = p_resume_id AND record_status = 1) INTO v_certifications_exists;
    
    SELECT COUNT(*) INTO v_languages_count FROM public.resume_languages WHERE resume_id = p_resume_id AND record_status = 1;
    IF v_languages_count > 0 THEN
        v_languages_exists := TRUE;
    ELSE
        SELECT resume_json INTO v_resume_json FROM public.resume_master WHERE resume_id = p_resume_id AND record_status = 1;
        IF v_resume_json IS NOT NULL AND jsonb_typeof(v_resume_json->'languages') = 'array' AND jsonb_array_length(v_resume_json->'languages') > 0 THEN
            v_languages_exists := TRUE;
        END IF;
    END IF;

    -- Count completed
    IF v_personal_exists THEN v_completed_count := v_completed_count + 1; END IF;
    IF v_summary_exists THEN v_completed_count := v_completed_count + 1; END IF;
    IF v_skills_exists THEN v_completed_count := v_completed_count + 1; END IF;
    IF v_projects_exists THEN v_completed_count := v_completed_count + 1; END IF;
    IF v_experience_exists THEN v_completed_count := v_completed_count + 1; END IF;
    IF v_education_exists THEN v_completed_count := v_completed_count + 1; END IF;
    IF v_certifications_exists THEN v_completed_count := v_completed_count + 1; END IF;
    IF v_languages_exists THEN v_completed_count := v_completed_count + 1; END IF;

    v_percentage := ROUND((v_completed_count / 8.0) * 100);

    -- Build sections JSON array
    v_sections := v_sections || jsonb_build_object('name', 'Contact Information', 'status', CASE WHEN v_personal_exists THEN 'Completed' ELSE 'Missing' END, 'percentage', CASE WHEN v_personal_exists THEN 100 ELSE 0 END);
    v_sections := v_sections || jsonb_build_object('name', 'Summary', 'status', CASE WHEN v_summary_exists THEN 'Completed' ELSE 'Missing' END, 'percentage', CASE WHEN v_summary_exists THEN 100 ELSE 0 END);
    v_sections := v_sections || jsonb_build_object('name', 'Skills', 'status', CASE WHEN v_skills_exists THEN 'Completed' ELSE 'Missing' END, 'percentage', CASE WHEN v_skills_exists THEN 100 ELSE 0 END);
    v_sections := v_sections || jsonb_build_object('name', 'Projects', 'status', CASE WHEN v_projects_exists THEN 'Completed' ELSE 'Missing' END, 'percentage', CASE WHEN v_projects_exists THEN 100 ELSE 0 END);
    v_sections := v_sections || jsonb_build_object('name', 'Experience', 'status', CASE WHEN v_experience_exists THEN 'Completed' ELSE 'Missing' END, 'percentage', CASE WHEN v_experience_exists THEN 100 ELSE 0 END);
    v_sections := v_sections || jsonb_build_object('name', 'Education', 'status', CASE WHEN v_education_exists THEN 'Completed' ELSE 'Missing' END, 'percentage', CASE WHEN v_education_exists THEN 100 ELSE 0 END);
    v_sections := v_sections || jsonb_build_object('name', 'Certifications', 'status', CASE WHEN v_certifications_exists THEN 'Completed' ELSE 'Missing' END, 'percentage', CASE WHEN v_certifications_exists THEN 100 ELSE 0 END);
    v_sections := v_sections || jsonb_build_object('name', 'Languages', 'status', CASE WHEN v_languages_exists THEN 'Completed' ELSE 'Missing' END, 'percentage', CASE WHEN v_languages_exists THEN 100 ELSE 0 END);

    RETURN json_build_object(
        'percentage', v_percentage,
        'sections', v_sections
    );
END;
$$ LANGUAGE plpgsql;

----------------------------------------------------------------------------------
-- PostgreSQL Function: calculate_ats_score
----------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.calculate_ats_score(p_resume_id bigint)
RETURNS json AS $$
DECLARE
    -- Weight Rule Values
    v_w_contact numeric := 10;
    v_w_summary numeric := 10;
    v_w_skills numeric := 15;
    v_w_projects numeric := 15;
    v_w_experience numeric := 15;
    v_w_education numeric := 10;
    v_w_certifications numeric := 5;
    v_w_languages numeric := 5;
    v_w_keyword_match numeric := 10;
    v_w_formatting numeric := 5;

    -- Computed scores per section
    v_s_contact int := 0;
    v_s_summary int := 0;
    v_s_skills int := 0;
    v_s_projects int := 0;
    v_s_experience int := 0;
    v_s_education int := 0;
    v_s_certifications int := 0;
    v_s_languages int := 0;
    v_s_keyword_match int := 0;
    v_s_formatting int := 0;
    v_s_overall int := 0;

    -- Individual calculation values
    v_email CHARACTER VARYING;
    v_mobile CHARACTER VARYING;
    v_linkedin_url CHARACTER VARYING;
    v_github_url CHARACTER VARYING;
    v_summary_text text;

    v_skills_count int := 0;
    v_projects_count int := 0;
    v_experience_count int := 0;
    v_education_count int := 0;
    v_certifications_count int := 0;
    v_languages_count int := 0;
    v_resume_json jsonb;

    v_role CHARACTER VARYING;
    v_total_keywords int := 0;
    v_matched_keywords int := 0;
    v_score_id bigint;
    v_result json;
BEGIN
    -- 1. Fetch rules from database to support dynamic weights
    SELECT COALESCE(MIN(rule_value) FILTER (WHERE rule_name = 'weight_contact'), 10) INTO v_w_contact FROM public.ats_rules;
    SELECT COALESCE(MIN(rule_value) FILTER (WHERE rule_name = 'weight_summary'), 10) INTO v_w_summary FROM public.ats_rules;
    SELECT COALESCE(MIN(rule_value) FILTER (WHERE rule_name = 'weight_skills'), 15) INTO v_w_skills FROM public.ats_rules;
    SELECT COALESCE(MIN(rule_value) FILTER (WHERE rule_name = 'weight_projects'), 15) INTO v_w_projects FROM public.ats_rules;
    SELECT COALESCE(MIN(rule_value) FILTER (WHERE rule_name = 'weight_experience'), 15) INTO v_w_experience FROM public.ats_rules;
    SELECT COALESCE(MIN(rule_value) FILTER (WHERE rule_name = 'weight_education'), 10) INTO v_w_education FROM public.ats_rules;
    SELECT COALESCE(MIN(rule_value) FILTER (WHERE rule_name = 'weight_certifications'), 5) INTO v_w_certifications FROM public.ats_rules;
    SELECT COALESCE(MIN(rule_value) FILTER (WHERE rule_name = 'weight_languages'), 5) INTO v_w_languages FROM public.ats_rules;
    SELECT COALESCE(MIN(rule_value) FILTER (WHERE rule_name = 'weight_keyword_match'), 10) INTO v_w_keyword_match FROM public.ats_rules;
    SELECT COALESCE(MIN(rule_value) FILTER (WHERE rule_name = 'weight_formatting'), 5) INTO v_w_formatting FROM public.ats_rules;

    -- 2. Calculate Contact Information (25 pts each: email, mobile, address, LinkedIn)
    SELECT email, mobile, linkedin_url, github_url, professional_summary 
    INTO v_email, v_mobile, v_linkedin_url, v_github_url, v_summary_text
    FROM public.resume_personal 
    WHERE resume_id = p_resume_id AND record_status = 1
    LIMIT 1;

    IF v_email IS NOT NULL AND v_email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$' THEN
        v_s_contact := v_s_contact + 25;
    END IF;
    IF v_mobile IS NOT NULL AND length(REGEXP_REPLACE(v_mobile, '\D', '', 'g')) >= 10 THEN
        v_s_contact := v_s_contact + 25;
    END IF;
    IF v_linkedin_url IS NOT NULL AND v_linkedin_url ILIKE '%linkedin.com%' THEN
        v_s_contact := v_s_contact + 25;
    END IF;
    IF v_github_url IS NOT NULL AND v_github_url ILIKE '%github.com%' THEN
        v_s_contact := v_s_contact + 25;
    ELSIF v_email IS NOT NULL THEN
        v_s_contact := v_s_contact + 25; -- Fallback point if either exists
    END IF;

    -- 3. Calculate Summary Score
    IF v_summary_text IS NOT NULL AND TRIM(v_summary_text) <> '' THEN
        IF length(v_summary_text) >= 150 THEN
            v_s_summary := 100;
        ELSIF length(v_summary_text) >= 50 THEN
            v_s_summary := 70;
        ELSE
            v_s_summary := 40;
        END IF;
    ELSE
        v_s_summary := 0;
    END IF;

    -- 4. Calculate Skills Score (8 or more skills = 100%)
    SELECT COUNT(*) INTO v_skills_count FROM public.resume_skills WHERE resume_id = p_resume_id AND record_status = 1;
    IF v_skills_count >= 8 THEN
        v_s_skills := 100;
    ELSE
        v_s_skills := v_skills_count * 12.5; -- 8 * 12.5 = 100
    END IF;

    -- 5. Calculate Projects Score (2 or more projects = 100%, 1 project = 50%)
    SELECT COUNT(*) INTO v_projects_count FROM public.resume_projects WHERE resume_id = p_resume_id AND record_status = 1;
    IF v_projects_count >= 2 THEN
        v_s_projects := 100;
    ELSIF v_projects_count = 1 THEN
        v_s_projects := 60;
    ELSE
        v_s_projects := 0;
    END IF;

    -- 6. Calculate Experience Score
    SELECT COUNT(*) INTO v_experience_count FROM public.resume_experience WHERE resume_id = p_resume_id AND record_status = 1;
    IF v_experience_count >= 2 THEN
        v_s_experience := 100;
    ELSIF v_experience_count = 1 THEN
        v_s_experience := 80;
    ELSE
        v_s_experience := 0;
    END IF;

    -- 7. Calculate Education Score
    SELECT COUNT(*) INTO v_education_count FROM public.resume_education WHERE resume_id = p_resume_id AND record_status = 1;
    IF v_education_count >= 1 THEN
        v_s_education := 100;
    ELSE
        v_s_education := 0;
    END IF;

    -- 8. Calculate Certifications Score
    SELECT COUNT(*) INTO v_certifications_count FROM public.resume_certifications WHERE resume_id = p_resume_id AND record_status = 1;
    IF v_certifications_count >= 1 THEN
        v_s_certifications := 100;
    ELSE
        v_s_certifications := 0;
    END IF;

    -- 9. Calculate Languages Score
    SELECT COUNT(*) INTO v_languages_count FROM public.resume_languages WHERE resume_id = p_resume_id AND record_status = 1;
    IF v_languages_count = 0 THEN
        SELECT resume_json INTO v_resume_json FROM public.resume_master WHERE resume_id = p_resume_id AND record_status = 1;
        IF v_resume_json IS NOT NULL AND jsonb_typeof(v_resume_json->'languages') = 'array' THEN
            v_languages_count := jsonb_array_length(v_resume_json->'languages');
        END IF;
    END IF;
    IF v_languages_count >= 1 THEN
        v_s_languages := 100;
    ELSE
        v_s_languages := 0;
    END IF;

    -- 10. Calculate Keyword Match Percentage
    v_role := public.fn_detect_resume_role(p_resume_id);
    SELECT COUNT(*) INTO v_total_keywords FROM public.ats_keywords WHERE job_role = v_role;
    
    IF v_total_keywords > 0 THEN
        SELECT json_array_length(public.get_keyword_matches(p_resume_id)) INTO v_matched_keywords;
        v_s_keyword_match := ROUND((v_matched_keywords::numeric / v_total_keywords::numeric) * 100);
    ELSE
        v_s_keyword_match := 100; -- If no keywords defined for that role
    END IF;

    -- 11. Calculate Formatting Score (Checks standard structures)
    v_s_formatting := 60; -- Baseline
    IF v_email IS NOT NULL AND v_email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$' THEN
        v_s_formatting := v_s_formatting + 10;
    END IF;
    IF v_mobile IS NOT NULL AND length(REGEXP_REPLACE(v_mobile, '\D', '', 'g')) >= 10 THEN
        v_s_formatting := v_s_formatting + 10;
    END IF;
    -- Verify presence of start and end dates in experience or education
    IF EXISTS(SELECT 1 FROM public.resume_experience WHERE resume_id = p_resume_id AND start_date IS NOT NULL) THEN
        v_s_formatting := v_s_formatting + 10;
    END IF;
    -- Verify no weird chars or short titles
    IF EXISTS(SELECT 1 FROM public.resume_master WHERE resume_id = p_resume_id AND resume_title <> 'Untitled Resume') THEN
        v_s_formatting := v_s_formatting + 10;
    END IF;
    IF v_s_formatting > 100 THEN v_s_formatting := 100; END IF;

    -- 12. Compute Overall Score as a weighted average
    v_s_overall := ROUND(
        (v_s_contact * v_w_contact +
         v_s_summary * v_w_summary +
         v_s_skills * v_w_skills +
         v_s_projects * v_w_projects +
         v_s_experience * v_w_experience +
         v_s_education * v_w_education +
         v_s_certifications * v_w_certifications +
         v_s_languages * v_w_languages +
         v_s_keyword_match * v_w_keyword_match +
         v_s_formatting * v_w_formatting) / 100.0
    );

    -- Capping at 100 and floor at 0
    IF v_s_overall > 100 THEN v_s_overall := 100; END IF;
    IF v_s_overall < 0 THEN v_s_overall := 0; END IF;

    -- 13. Persist to public.ats_score_master
    INSERT INTO public.ats_score_master (
        resume_id, overall_score, contact_information, summary, skills, 
        projects, experience, education, certifications, languages, 
        keyword_match, formatting, created_on
    )
    VALUES (
        p_resume_id, v_s_overall, v_s_contact, v_s_summary, v_s_skills,
        v_s_projects, v_s_experience, v_s_education, v_s_certifications, v_s_languages,
        v_s_keyword_match, v_s_formatting, CURRENT_TIMESTAMP
    )
    ON CONFLICT (resume_id) 
    DO UPDATE SET 
        overall_score = EXCLUDED.overall_score,
        contact_information = EXCLUDED.contact_information,
        summary = EXCLUDED.summary,
        skills = EXCLUDED.skills,
        projects = EXCLUDED.projects,
        experience = EXCLUDED.experience,
        education = EXCLUDED.education,
        certifications = EXCLUDED.certifications,
        languages = EXCLUDED.languages,
        keyword_match = EXCLUDED.keyword_match,
        formatting = EXCLUDED.formatting,
        created_on = CURRENT_TIMESTAMP
    RETURNING ats_score_id INTO v_score_id;

    -- Update audit trails in public.ats_score_details
    DELETE FROM public.ats_score_details WHERE ats_score_id = v_score_id;
    INSERT INTO public.ats_score_details (ats_score_id, section_name, score, comments)
    VALUES
    (v_score_id, 'Contact Information', v_s_contact, 'Evaluated phone, email, and social networks completeness'),
    (v_score_id, 'Summary', v_s_summary, 'Evaluated professional statement length and value'),
    (v_score_id, 'Skills', v_s_skills, 'Checked technical skills counts'),
    (v_score_id, 'Projects', v_s_projects, 'Calculated based on projects completeness'),
    (v_score_id, 'Experience', v_s_experience, 'Evaluated history items and descriptors'),
    (v_score_id, 'Education', v_s_education, 'Checked degree and institution details'),
    (v_score_id, 'Certifications', v_s_certifications, 'Checked verified credentials list'),
    (v_score_id, 'Languages', v_s_languages, 'Checked user languages count'),
    (v_score_id, 'Keyword Match', v_s_keyword_match, 'Evaluated similarity to target job keywords'),
    (v_score_id, 'Formatting', v_s_formatting, 'Ran basic schema layout checks');

    -- 14. Return the exact JSON required
    SELECT json_build_object(
        'overall_score', v_s_overall,
        'contact_information', v_s_contact,
        'summary', v_s_summary,
        'skills', v_s_skills,
        'projects', v_s_projects,
        'experience', v_s_experience,
        'education', v_s_education,
        'certifications', v_s_certifications,
        'languages', v_s_languages,
        'keyword_match', v_s_keyword_match,
        'formatting', v_s_formatting
    ) INTO v_result;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql;

----------------------------------------------------------------------------------
-- PostgreSQL Function: download_ats_report
----------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.download_ats_report(p_resume_id bigint)
RETURNS json AS $$
DECLARE
    v_score_id bigint;
    v_score_json json;
    v_matches json;
    v_missing json;
    v_suggestions json;
    v_sections json;
    v_report_data jsonb;
    v_report_id bigint;
BEGIN
    -- Re-run calculations
    v_score_json := public.calculate_ats_score(p_resume_id);
    
    SELECT ats_score_id INTO v_score_id FROM public.ats_score_master WHERE resume_id = p_resume_id;
    
    -- Extract info for the PDF download logging
    v_matches := public.get_keyword_matches(p_resume_id);
    v_missing := public.get_missing_keywords(p_resume_id);
    v_suggestions := public.get_resume_suggestions(p_resume_id);
    v_sections := public.get_resume_sections_status(p_resume_id);

    v_report_data := jsonb_build_object(
        'scores', v_score_json,
        'matched_keywords', v_matches,
        'missing_keywords', v_missing,
        'suggestions', v_suggestions,
        'sections_status', v_sections,
        'downloaded_on', CURRENT_TIMESTAMP
    );

    -- Log report download in DB
    INSERT INTO public.ats_resume_reports (resume_id, ats_score_id, report_data, downloaded_on)
    VALUES (p_resume_id, v_score_id, v_report_data, CURRENT_TIMESTAMP)
    RETURNING report_id INTO v_report_id;

    RETURN jsonb_build_object(
        'report_id', v_report_id,
        'resume_id', p_resume_id,
        'overall_score', (v_score_json->>'overall_score')::int,
        'report_data', v_report_data
    );
END;
$$ LANGUAGE plpgsql;

----------------------------------------------------------------------------------
-- PostgreSQL Function: get_ats_dashboard
----------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_ats_dashboard(p_resume_id bigint)
RETURNS json AS $$
DECLARE
    v_score_json json;
    v_matches json;
    v_missing json;
    v_suggestions json;
    v_sections json;
    v_role CHARACTER VARYING;
    v_title CHARACTER VARYING;
    v_recommended json;
    v_result json;
BEGIN
    -- 1. Ensure latest score is calculated
    v_score_json := public.calculate_ats_score(p_resume_id);

    -- 2. Detect resume role and fetch recommended keywords
    v_role := public.fn_detect_resume_role(p_resume_id);
    
    SELECT json_agg(row_to_json(k)) INTO v_recommended
    FROM (
        SELECT keyword, priority, is_required 
        FROM public.ats_keywords 
        WHERE job_role = v_role
    ) k;
    
    IF v_recommended IS NULL THEN
        v_recommended := '[]'::json;
    END IF;

    -- 3. Fetch matched & missing keywords
    v_matches := public.get_keyword_matches(p_resume_id);
    v_missing := public.get_missing_keywords(p_resume_id);

    -- 4. Get suggestions checklist
    v_suggestions := public.get_resume_suggestions(p_resume_id);

    -- 5. Get sections completed/missing status
    v_sections := public.get_resume_sections_status(p_resume_id);

    -- Fetch user details / resume name for additional dashboard attributes
    SELECT resume_title INTO v_title FROM public.resume_master WHERE resume_id = p_resume_id;

    -- 6. Assemble everything
    SELECT json_build_object(
        'resume_id', p_resume_id,
        'resume_title', COALESCE(v_title, 'My Resume'),
        'detected_role', v_role,
        'scores', v_score_json,
        'keywords', json_build_object(
            'matched', v_matches,
            'missing', v_missing,
            'recommended', v_recommended
        ),
        'suggestions', v_suggestions,
        'sections_status', v_sections
    ) INTO v_result;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql;
