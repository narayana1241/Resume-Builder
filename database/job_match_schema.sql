-- Job Match Analyzer Database Schema & PL/pgSQL Functions
-- Authors: Antigravity Pair Programmer

-- 1. Job Descriptions Master Table
CREATE TABLE IF NOT EXISTS public.job_descriptions (
    job_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    job_title CHARACTER VARYING,
    company_name CHARACTER VARYING,
    job_url CHARACTER VARYING,
    job_description_text TEXT NOT NULL,
    created_on TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Job Keywords Table
CREATE TABLE IF NOT EXISTS public.job_keywords (
    keyword_id SERIAL PRIMARY KEY,
    job_id BIGINT NOT NULL REFERENCES public.job_descriptions(job_id) ON DELETE CASCADE,
    keyword CHARACTER VARYING NOT NULL,
    category CHARACTER VARYING NOT NULL, -- 'Skill' or 'Keyword'
    priority CHARACTER VARYING NOT NULL -- 'High', 'Medium', 'Low'
);

-- 3. Job Analysis Results Table
CREATE TABLE IF NOT EXISTS public.job_analysis (
    analysis_id BIGSERIAL PRIMARY KEY,
    resume_id BIGINT NOT NULL REFERENCES public.resume_master(resume_id) ON DELETE CASCADE,
    job_id BIGINT NOT NULL REFERENCES public.job_descriptions(job_id) ON DELETE CASCADE,
    overall_score INT NOT NULL,
    shortlist_probability CHARACTER VARYING(10) NOT NULL, -- High, Medium, Low
    skills_match INT NOT NULL,
    experience_match INT NOT NULL,
    education_match INT NOT NULL,
    projects_match INT NOT NULL,
    keyword_match INT NOT NULL,
    created_on TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for optimizing lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_job_analysis_resume_job ON public.job_analysis(resume_id, job_id);

-- 4. Job Match Reports Table
CREATE TABLE IF NOT EXISTS public.job_match_reports (
    report_id BIGSERIAL PRIMARY KEY,
    analysis_id BIGINT NOT NULL REFERENCES public.job_analysis(analysis_id) ON DELETE CASCADE,
    report_data JSONB NOT NULL,
    created_on TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Job Match Rules Table
CREATE TABLE IF NOT EXISTS public.job_match_rules (
    rule_id SERIAL PRIMARY KEY,
    rule_name CHARACTER VARYING UNIQUE NOT NULL,
    rule_value NUMERIC NOT NULL,
    description TEXT
);

-- Seeding Default Weights & Configs for Job Match Analyzer
INSERT INTO public.job_match_rules (rule_name, rule_value, description)
VALUES 
('weight_skills_match', 30.0, 'Weight percentage for Skills matching in Job Match Score'),
('weight_experience_match', 25.0, 'Weight percentage for Experience matching in Job Match Score'),
('weight_education_match', 10.0, 'Weight percentage for Education matching in Job Match Score'),
('weight_projects_match', 15.0, 'Weight percentage for Projects matching in Job Match Score'),
('weight_keyword_match', 20.0, 'Weight percentage for Keyword overlap in Job Match Score')
ON CONFLICT (rule_name) DO UPDATE SET rule_value = EXCLUDED.rule_value;

----------------------------------------------------------------------------------
-- PL/pgSQL Function: extract_job_keywords
----------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.extract_job_keywords(p_job_id bigint)
RETURNS void AS $$
DECLARE
    v_desc text;
    v_skills text[] := ARRAY['Java', 'Spring Boot', 'SQL', 'PostgreSQL', 'React', 'Node.js', 'Express', 'JavaScript', 'HTML', 'CSS', 'REST API', 'Docker', 'Git', 'AWS', 'TypeScript', 'Python', 'Microservices', 'MongoDB', 'Kubernetes', 'CI/CD', 'Linux', 'Spring'];
    v_keywords text[] := ARRAY['Core Java', 'Agile', 'Software Engineer', 'Developer', 'Database Design', 'Query Optimization', 'Stored Procedures', 'CTEs', 'Performance Tuning', 'System Design', 'Testing', 'Scrum', 'Management', 'Communication'];
    v_word text;
BEGIN
    SELECT job_description_text INTO v_desc FROM public.job_descriptions WHERE job_id = p_job_id;
    
    IF v_desc IS NULL OR v_desc = '' THEN
        RETURN;
    END IF;

    -- Delete any existing keywords for this job ID to prevent duplicates
    DELETE FROM public.job_keywords WHERE job_id = p_job_id;

    -- 1. Extract Skills
    FOREACH v_word IN ARRAY v_skills LOOP
        IF v_desc ~* ('\y' || regexp_replace(v_word, '([^a-zA-Z0-9])', '\\\1', 'g') || '\y') THEN
            INSERT INTO public.job_keywords (job_id, keyword, category, priority)
            VALUES (p_job_id, v_word, 'Skill', CASE WHEN v_word IN ('Java', 'Spring Boot', 'PostgreSQL', 'React', 'Docker', 'REST API') THEN 'High' ELSE 'Medium' END);
        END IF;
    END LOOP;

    -- 2. Extract Keywords
    FOREACH v_word IN ARRAY v_keywords LOOP
        IF v_desc ~* ('\y' || regexp_replace(v_word, '([^a-zA-Z0-9])', '\\\1', 'g') || '\y') THEN
            INSERT INTO public.job_keywords (job_id, keyword, category, priority)
            VALUES (p_job_id, v_word, 'Keyword', 'Medium');
        END IF;
    END LOOP;

    -- If no keywords were found, insert a fallback keyword based on job title
    IF NOT EXISTS(SELECT 1 FROM public.job_keywords WHERE job_id = p_job_id) THEN
        INSERT INTO public.job_keywords (job_id, keyword, category, priority)
        VALUES (p_job_id, 'Software Development', 'Keyword', 'High');
    END IF;

END;
$$ LANGUAGE plpgsql;

----------------------------------------------------------------------------------
-- PL/pgSQL Function: save_job_description
----------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.save_job_description(
    p_user_id bigint,
    p_job_title varchar,
    p_company_name varchar,
    p_job_url varchar,
    p_job_description_text text
)
RETURNS bigint AS $$
DECLARE
    v_job_id bigint;
BEGIN
    INSERT INTO public.job_descriptions (user_id, job_title, company_name, job_url, job_description_text, created_on)
    VALUES (p_user_id, p_job_title, p_company_name, p_job_url, p_job_description_text, CURRENT_TIMESTAMP)
    RETURNING job_id INTO v_job_id;

    -- Automatically extract keywords inside DB trigger logic
    PERFORM public.extract_job_keywords(v_job_id);

    RETURN v_job_id;
END;
$$ LANGUAGE plpgsql;

----------------------------------------------------------------------------------
-- PL/pgSQL Function: calculate_shortlist_probability
----------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.calculate_shortlist_probability(p_score int)
RETURNS varchar AS $$
BEGIN
    IF p_score >= 80 THEN
        RETURN 'High';
    ELSIF p_score >= 50 THEN
        RETURN 'Medium';
    ELSE
        RETURN 'Low';
    END IF;
END;
$$ LANGUAGE plpgsql;

----------------------------------------------------------------------------------
-- PL/pgSQL Function: get_missing_skills
----------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_missing_skills(p_resume_id bigint, p_job_id bigint)
RETURNS json AS $$
DECLARE
    v_missing json;
BEGIN
    WITH missing_sk AS (
        SELECT DISTINCT jk.keyword
        FROM public.job_keywords jk
        WHERE jk.job_id = p_job_id AND jk.category = 'Skill' AND NOT EXISTS (
            SELECT 1 FROM public.resume_skills rs 
            WHERE rs.resume_id = p_resume_id AND rs.record_status = 1 AND rs.skill_name ILIKE '%' || jk.keyword || '%'
        )
    )
    SELECT COALESCE(json_agg(keyword), '[]'::json) INTO v_missing FROM missing_sk;
    RETURN v_missing;
END;
$$ LANGUAGE plpgsql;

----------------------------------------------------------------------------------
-- PL/pgSQL Function: get_missing_keywords
----------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_missing_keywords(p_resume_id bigint, p_job_id bigint)
RETURNS json AS $$
DECLARE
    v_missing json;
BEGIN
    WITH missing_kw AS (
        SELECT DISTINCT jk.keyword
        FROM public.job_keywords jk
        WHERE jk.job_id = p_job_id AND jk.category = 'Keyword' AND NOT EXISTS (
            -- Verify keywords across skills, summaries, experience, or projects
            SELECT 1 FROM public.resume_skills s WHERE s.resume_id = p_resume_id AND s.record_status = 1 AND s.skill_name ILIKE '%' || jk.keyword || '%'
            UNION
            SELECT 1 FROM public.resume_personal pers WHERE pers.resume_id = p_resume_id AND pers.record_status = 1 AND pers.professional_summary ILIKE '%' || jk.keyword || '%'
            UNION
            SELECT 1 FROM public.resume_experience exp WHERE exp.resume_id = p_resume_id AND exp.record_status = 1 AND (exp.job_title ILIKE '%' || jk.keyword || '%' OR exp.job_description ILIKE '%' || jk.keyword || '%')
            UNION
            SELECT 1 FROM public.resume_projects proj WHERE proj.resume_id = p_resume_id AND proj.record_status = 1 AND (proj.project_name ILIKE '%' || jk.keyword || '%' OR proj.project_description ILIKE '%' || jk.keyword || '%')
        )
    )
    SELECT COALESCE(json_agg(keyword), '[]'::json) INTO v_missing FROM missing_kw;
    RETURN v_missing;
END;
$$ LANGUAGE plpgsql;

----------------------------------------------------------------------------------
-- PL/pgSQL Function: generate_recommendations
----------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.generate_recommendations(p_resume_id bigint, p_job_id bigint)
RETURNS json AS $$
DECLARE
    v_recs jsonb := '[]'::jsonb;
    v_sk_missing json;
    v_kw_missing json;
    v_sk text;
    v_kw text;
    v_personal_summary text;
    v_count int := 0;
BEGIN
    -- Fetch missing categories
    v_sk_missing := public.get_missing_skills(p_resume_id, p_job_id);
    v_kw_missing := public.get_missing_keywords(p_resume_id, p_job_id);

    -- Loop through missing skills and generate recommendations
    FOR v_sk IN SELECT json_array_elements_text(v_sk_missing) LOOP
        v_count := v_count + 1;
        IF v_count <= 4 THEN
            IF v_sk IN ('Spring Boot', 'React', 'Docker', 'Kubernetes', 'AWS') THEN
                v_recs := v_recs || jsonb_build_array('Add ' || v_sk || ' project.');
            ELSE
                v_recs := v_recs || jsonb_build_array('Add ' || v_sk || ' skills.');
            END IF;
        END IF;
    END LOOP;

    -- Loop through missing keywords
    v_count := 0;
    FOR v_kw IN SELECT json_array_elements_text(v_kw_missing) LOOP
        v_count := v_count + 1;
        IF v_count <= 3 THEN
            v_recs := v_recs || jsonb_build_array('Mention ' || v_kw || ' experience.');
        END IF;
    END LOOP;

    -- Verify professional summary quality
    SELECT professional_summary INTO v_personal_summary FROM public.resume_personal WHERE resume_id = p_resume_id LIMIT 1;
    IF v_personal_summary IS NULL OR length(v_personal_summary) < 80 THEN
        v_recs := v_recs || jsonb_build_array('Improve professional summary.');
    END IF;

    RETURN v_recs::json;
END;
$$ LANGUAGE plpgsql;

----------------------------------------------------------------------------------
-- PL/pgSQL Function: save_match_report
----------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.save_match_report(p_analysis_id bigint, p_report_data jsonb)
RETURNS bigint AS $$
DECLARE
    v_report_id bigint;
BEGIN
    INSERT INTO public.job_match_reports (analysis_id, report_data, created_on)
    VALUES (p_analysis_id, p_report_data, CURRENT_TIMESTAMP)
    RETURNING report_id INTO v_report_id;
    
    RETURN v_report_id;
END;
$$ LANGUAGE plpgsql;

----------------------------------------------------------------------------------
-- PL/pgSQL Function: calculate_resume_job_match
----------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.calculate_resume_job_match(
    p_resume_id bigint,
    p_job_id bigint
)
RETURNS json AS $$
DECLARE
    -- Weight Config Rules
    v_w_skills numeric := 30;
    v_w_experience numeric := 25;
    v_w_education numeric := 10;
    v_w_projects numeric := 15;
    v_w_keywords numeric := 20;

    -- Scores Computed
    v_s_skills int := 0;
    v_s_experience int := 0;
    v_s_education int := 0;
    v_s_projects int := 0;
    v_s_keywords int := 0;
    v_s_overall int := 0;

    v_prob varchar(10);
    v_matched_skills json;
    v_missing_skills json;
    v_matched_keywords json;
    v_missing_keywords json;
    v_recommendations json;

    -- Calculations helpers
    v_job_skills_count int := 0;
    v_matched_skills_count int := 0;
    v_job_keywords_count int := 0;
    v_matched_keywords_count int := 0;

    v_experience_count int := 0;
    v_projects_count int := 0;
    v_education_exists boolean := false;
    v_degree_requirement varchar;
    v_analysis_id bigint;
    v_report_data jsonb;
    v_result json;
BEGIN
    -- 1. Fetch rules weights
    SELECT COALESCE(MIN(rule_value) FILTER (WHERE rule_name = 'weight_skills_match'), 30) INTO v_w_skills FROM public.job_match_rules;
    SELECT COALESCE(MIN(rule_value) FILTER (WHERE rule_name = 'weight_experience_match'), 25) INTO v_w_experience FROM public.job_match_rules;
    SELECT COALESCE(MIN(rule_value) FILTER (WHERE rule_name = 'weight_education_match'), 10) INTO v_w_education FROM public.job_match_rules;
    SELECT COALESCE(MIN(rule_value) FILTER (WHERE rule_name = 'weight_projects_match'), 15) INTO v_w_projects FROM public.job_match_rules;
    SELECT COALESCE(MIN(rule_value) FILTER (WHERE rule_name = 'weight_keyword_match'), 20) INTO v_w_keywords FROM public.job_match_rules;

    -- 2. Skills Match %
    SELECT COUNT(*) INTO v_job_skills_count FROM public.job_keywords WHERE job_id = p_job_id AND category = 'Skill';
    IF v_job_skills_count > 0 THEN
        SELECT COUNT(DISTINCT jk.keyword) INTO v_matched_skills_count
        FROM public.job_keywords jk
        INNER JOIN public.resume_skills rs ON rs.resume_id = p_resume_id AND rs.record_status = 1 AND rs.skill_name ILIKE '%' || jk.keyword || '%'
        WHERE jk.job_id = p_job_id AND jk.category = 'Skill';
        
        v_s_skills := ROUND((v_matched_skills_count::numeric / v_job_skills_count::numeric) * 100);
    ELSE
        v_s_skills := 100;
    END IF;

    -- Assemble lists of matched & missing skills
    WITH matched_sk AS (
        SELECT DISTINCT jk.keyword
        FROM public.job_keywords jk
        INNER JOIN public.resume_skills rs ON rs.resume_id = p_resume_id AND rs.record_status = 1 AND rs.skill_name ILIKE '%' || jk.keyword || '%'
        WHERE jk.job_id = p_job_id AND jk.category = 'Skill'
    )
    SELECT COALESCE(json_agg(keyword), '[]'::json) INTO v_matched_skills FROM matched_sk;
    v_missing_skills := public.get_missing_skills(p_resume_id, p_job_id);

    -- 3. Keywords Match %
    SELECT COUNT(*) INTO v_job_keywords_count FROM public.job_keywords WHERE job_id = p_job_id AND category = 'Keyword';
    IF v_job_keywords_count > 0 THEN
        SELECT COUNT(DISTINCT jk.keyword) INTO v_matched_keywords_count
        FROM public.job_keywords jk
        WHERE jk.job_id = p_job_id AND jk.category = 'Keyword' AND (
            EXISTS(SELECT 1 FROM public.resume_skills s WHERE s.resume_id = p_resume_id AND s.record_status = 1 AND s.skill_name ILIKE '%' || jk.keyword || '%') OR
            EXISTS(SELECT 1 FROM public.resume_personal pers WHERE pers.resume_id = p_resume_id AND pers.record_status = 1 AND pers.professional_summary ILIKE '%' || jk.keyword || '%') OR
            EXISTS(SELECT 1 FROM public.resume_experience exp WHERE exp.resume_id = p_resume_id AND exp.record_status = 1 AND (exp.job_title ILIKE '%' || jk.keyword || '%' OR exp.job_description ILIKE '%' || jk.keyword || '%')) OR
            EXISTS(SELECT 1 FROM public.resume_projects proj WHERE proj.resume_id = p_resume_id AND proj.record_status = 1 AND (proj.project_name ILIKE '%' || jk.keyword || '%' OR proj.project_description ILIKE '%' || jk.keyword || '%'))
        );
        
        v_s_keywords := ROUND((v_matched_keywords_count::numeric / v_job_keywords_count::numeric) * 100);
    ELSE
        v_s_keywords := 100;
    END IF;

    -- Assemble lists of matched & missing keywords
    WITH matched_kw AS (
        SELECT DISTINCT jk.keyword
        FROM public.job_keywords jk
        WHERE jk.job_id = p_job_id AND jk.category = 'Keyword' AND (
            EXISTS(SELECT 1 FROM public.resume_skills s WHERE s.resume_id = p_resume_id AND s.record_status = 1 AND s.skill_name ILIKE '%' || jk.keyword || '%') OR
            EXISTS(SELECT 1 FROM public.resume_personal pers WHERE pers.resume_id = p_resume_id AND pers.record_status = 1 AND pers.professional_summary ILIKE '%' || jk.keyword || '%') OR
            EXISTS(SELECT 1 FROM public.resume_experience exp WHERE exp.resume_id = p_resume_id AND exp.record_status = 1 AND (exp.job_title ILIKE '%' || jk.keyword || '%' OR exp.job_description ILIKE '%' || jk.keyword || '%')) OR
            EXISTS(SELECT 1 FROM public.resume_projects proj WHERE proj.resume_id = p_resume_id AND proj.record_status = 1 AND (proj.project_name ILIKE '%' || jk.keyword || '%' OR proj.project_description ILIKE '%' || jk.keyword || '%'))
        )
    )
    SELECT COALESCE(json_agg(keyword), '[]'::json) INTO v_matched_keywords FROM matched_kw;
    v_missing_keywords := public.get_missing_keywords(p_resume_id, p_job_id);

    -- 4. Experience Match (Base points on count and text matches)
    SELECT COUNT(*) INTO v_experience_count FROM public.resume_experience WHERE resume_id = p_resume_id AND record_status = 1;
    IF v_experience_count >= 2 THEN
        v_s_experience := 100;
    ELSIF v_experience_count = 1 THEN
        v_s_experience := 75;
    ELSE
        v_s_experience := 30; -- Has no experience
    END IF;

    -- 5. Education Match (degree checks)
    SELECT EXISTS(SELECT 1 FROM public.resume_education WHERE resume_id = p_resume_id AND record_status = 1) INTO v_education_exists;
    IF v_education_exists THEN
        v_s_education := 100;
    ELSE
        v_s_education := 40;
    END IF;

    -- 6. Projects Match % (Check technology list overlap in projects)
    SELECT COUNT(*) INTO v_projects_count FROM public.resume_projects WHERE resume_id = p_resume_id AND record_status = 1;
    IF v_projects_count >= 2 THEN
        v_s_projects := 100;
    ELSIF v_projects_count = 1 THEN
        v_s_projects := 70;
    ELSE
        v_s_projects := 0;
    END IF;

    -- 7. Calculate Overall Score
    v_s_overall := ROUND(
        (v_s_skills * v_w_skills +
         v_s_experience * v_w_experience +
         v_s_education * v_w_education +
         v_s_projects * v_w_projects +
         v_s_keywords * v_w_keywords) / 100.0
    );

    IF v_s_overall > 100 THEN v_s_overall := 100; END IF;
    IF v_s_overall < 0 THEN v_s_overall := 0; END IF;

    -- Shortlist probability
    v_prob := public.calculate_shortlist_probability(v_s_overall);

    -- 8. Save/update job_analysis
    INSERT INTO public.job_analysis (
        resume_id, job_id, overall_score, shortlist_probability, 
        skills_match, experience_match, education_match, projects_match, keyword_match
    )
    VALUES (
        p_resume_id, p_job_id, v_s_overall, v_prob,
        v_s_skills, v_s_experience, v_s_education, v_s_projects, v_s_keywords
    )
    ON CONFLICT (resume_id, job_id)
    DO UPDATE SET
        overall_score = EXCLUDED.overall_score,
        shortlist_probability = EXCLUDED.shortlist_probability,
        skills_match = EXCLUDED.skills_match,
        experience_match = EXCLUDED.experience_match,
        education_match = EXCLUDED.education_match,
        projects_match = EXCLUDED.projects_match,
        keyword_match = EXCLUDED.keyword_match,
        created_on = CURRENT_TIMESTAMP
    RETURNING analysis_id INTO v_analysis_id;

    -- Fetch recommendations
    v_recommendations := public.generate_recommendations(p_resume_id, p_job_id);

    -- 9. Save Match Report
    v_report_data := jsonb_build_object(
        'overall_score', v_s_overall,
        'shortlist_probability', v_prob,
        'skills_match', v_s_skills,
        'experience_match', v_s_experience,
        'education_match', v_s_education,
        'projects_match', v_s_projects,
        'keyword_match', v_s_keywords,
        'matched_skills', v_matched_skills,
        'missing_skills', v_missing_skills,
        'matched_keywords', v_matched_keywords,
        'missing_keywords', v_missing_keywords,
        'recommendations', v_recommendations
    );

    PERFORM public.save_match_report(v_analysis_id, v_report_data);

    -- Assemble and return exact result payload
    SELECT json_build_object(
        'overall_score', v_s_overall,
        'shortlist_probability', v_prob,
        'skills_match', v_s_skills,
        'experience_match', v_s_experience,
        'education_match', v_s_education,
        'projects_match', v_s_projects,
        'keyword_match', v_s_keywords,
        'matched_skills', v_matched_skills,
        'missing_skills', v_missing_skills,
        'matched_keywords', v_matched_keywords,
        'missing_keywords', v_missing_keywords,
        'recommendations', v_recommendations
    ) INTO v_result;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql;
