-- Resume Builder Master Database Schema & PL/pgSQL Stored Procedures

-- ==============================================================================
-- 1. TABLES DEFINITIONS
-- ==============================================================================

-- 1. Users Master Table
CREATE TABLE IF NOT EXISTS public.users (
    user_id BIGSERIAL PRIMARY KEY,
    full_name CHARACTER VARYING(150) NOT NULL,
    email CHARACTER VARYING(150) UNIQUE NOT NULL,
    mobile CHARACTER VARYING(15),
    password_hash TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_on TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Resume Master Table
CREATE TABLE IF NOT EXISTS public.resume_master (
    resume_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES public.users(user_id) ON DELETE CASCADE,
    resume_title CHARACTER VARYING(150) DEFAULT 'Untitled Resume',
    template_id INT DEFAULT 1,
    resume_json JSONB,
    upload_confidence NUMERIC(5,2) DEFAULT 100.00,
    is_draft BOOLEAN DEFAULT TRUE,
    created_on TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    record_status SMALLINT DEFAULT 1
);

-- 3. Resume Personal Details Table
CREATE TABLE IF NOT EXISTS public.resume_personal (
    resume_personal_id BIGSERIAL PRIMARY KEY,
    resume_id BIGINT NOT NULL REFERENCES public.resume_master(resume_id) ON DELETE CASCADE,
    first_name CHARACTER VARYING(100),
    last_name CHARACTER VARYING(100),
    email CHARACTER VARYING(150),
    mobile CHARACTER VARYING(15),
    date_of_birth DATE,
    address TEXT,
    city CHARACTER VARYING(100),
    state CHARACTER VARYING(100),
    country CHARACTER VARYING(100),
    pincode CHARACTER VARYING(10),
    linkedin_url CHARACTER VARYING(255),
    github_url CHARACTER VARYING(255),
    portfolio_url CHARACTER VARYING(255),
    professional_summary TEXT,
    profile_photo CHARACTER VARYING(255),
    custom_hobby CHARACTER VARYING(255),
    favorite_language CHARACTER VARYING(255),
    created_on TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP WITHOUT TIME ZONE,
    record_status SMALLINT DEFAULT 1
);

-- 4. Resume Education Table
CREATE TABLE IF NOT EXISTS public.resume_education (
    education_id BIGSERIAL PRIMARY KEY,
    resume_id BIGINT NOT NULL REFERENCES public.resume_master(resume_id) ON DELETE CASCADE,
    degree CHARACTER VARYING(150),
    institution CHARACTER VARYING(150),
    university CHARACTER VARYING(150),
    field_of_study CHARACTER VARYING(150),
    specialization_track CHARACTER VARYING(150),
    start_year INT,
    end_year INT,
    cgpa_percentage NUMERIC(5,2),
    currently_studying BOOLEAN DEFAULT FALSE,
    created_on TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP WITHOUT TIME ZONE,
    record_status SMALLINT DEFAULT 1
);

-- 5. Resume Experience Table
CREATE TABLE IF NOT EXISTS public.resume_experience (
    experience_id BIGSERIAL PRIMARY KEY,
    resume_id BIGINT NOT NULL REFERENCES public.resume_master(resume_id) ON DELETE CASCADE,
    company_name CHARACTER VARYING(150),
    job_title CHARACTER VARYING(150),
    employment_type CHARACTER VARYING(50),
    location CHARACTER VARYING(100),
    remote_flag BOOLEAN DEFAULT FALSE,
    start_date DATE,
    end_date DATE,
    currently_working BOOLEAN DEFAULT FALSE,
    job_description TEXT,
    created_on TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP WITHOUT TIME ZONE,
    record_status SMALLINT DEFAULT 1
);

-- 6. Resume Skills Table
CREATE TABLE IF NOT EXISTS public.resume_skills (
    skill_id BIGSERIAL PRIMARY KEY,
    resume_id BIGINT NOT NULL REFERENCES public.resume_master(resume_id) ON DELETE CASCADE,
    skill_name CHARACTER VARYING(100) NOT NULL,
    skill_category CHARACTER VARYING(100),
    skill_level CHARACTER VARYING(50),
    experience_years NUMERIC(4,1),
    created_on TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP WITHOUT TIME ZONE,
    record_status SMALLINT DEFAULT 1
);

-- 7. Resume Projects Table
CREATE TABLE IF NOT EXISTS public.resume_projects (
    project_id BIGSERIAL PRIMARY KEY,
    resume_id BIGINT NOT NULL REFERENCES public.resume_master(resume_id) ON DELETE CASCADE,
    project_name CHARACTER VARYING(150) NOT NULL,
    technologies_used CHARACTER VARYING(255),
    role CHARACTER VARYING(100),
    start_date DATE,
    end_date DATE,
    currently_working BOOLEAN DEFAULT FALSE,
    github_url CHARACTER VARYING(255),
    live_project_url CHARACTER VARYING(255),
    project_description TEXT,
    created_on TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP WITHOUT TIME ZONE,
    record_status SMALLINT DEFAULT 1
);

-- 8. Resume Certifications Table
CREATE TABLE IF NOT EXISTS public.resume_certifications (
    certification_id BIGSERIAL PRIMARY KEY,
    resume_id BIGINT NOT NULL REFERENCES public.resume_master(resume_id) ON DELETE CASCADE,
    certification_name CHARACTER VARYING(150) NOT NULL,
    issuing_organization CHARACTER VARYING(150),
    issue_date DATE,
    expiry_date DATE,
    credential_id CHARACTER VARYING(100),
    credential_url CHARACTER VARYING(255),
    description TEXT,
    created_on TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP WITHOUT TIME ZONE,
    record_status SMALLINT DEFAULT 1
);

-- 9. Resume Custom Sections Table (Unknown/Additional Sections)
CREATE TABLE IF NOT EXISTS public.resume_custom_sections (
    custom_section_id BIGSERIAL PRIMARY KEY,
    resume_id BIGINT NOT NULL REFERENCES public.resume_master(resume_id) ON DELETE CASCADE,
    section_title CHARACTER VARYING(150) NOT NULL,
    section_data JSONB NOT NULL,
    display_order INT DEFAULT 1,
    created_on TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    record_status SMALLINT DEFAULT 1
);

-- ==============================================================================
-- 2. CORE PL/PGSQL FUNCTIONS & PROCEDURES
-- ==============================================================================

-- Login Check Function
CREATE OR REPLACE FUNCTION public.get_users_after_login(par_email varchar, par_password varchar)
RETURNS TABLE(user_id bigint, full_name varchar, email varchar, mobile varchar, is_active boolean, created_on timestamp, error_code varchar, error_message text) AS $$
DECLARE
    v_user record;
BEGIN
    SELECT u.user_id, u.full_name, u.email, u.mobile, u.is_active, u.created_on, u.password_hash 
    INTO v_user
    FROM public.users u 
    WHERE u.email = par_email AND u.is_active = TRUE;

    IF NOT FOUND THEN
        RETURN QUERY SELECT NULL::bigint, NULL::varchar, NULL::varchar, NULL::varchar, NULL::boolean, NULL::timestamp, '11111'::varchar, 'Invalid Email'::text;
    ELSIF v_user.password_hash <> par_password THEN
        RETURN QUERY SELECT NULL::bigint, NULL::varchar, NULL::varchar, NULL::varchar, NULL::boolean, NULL::timestamp, '99999'::varchar, 'Invalid Password'::text;
    ELSE
        RETURN QUERY SELECT v_user.user_id, v_user.full_name, v_user.email, v_user.mobile, v_user.is_active, v_user.created_on, '00000'::varchar, 'Login Successful'::text;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Get User Resumes Function
CREATE OR REPLACE FUNCTION public.get_user_resumes(par_user_id bigint)
RETURNS TABLE(sl_no integer, resume_id bigint, user_id bigint, resume_title varchar, template_name varchar, updated_on timestamp) AS $$
BEGIN
    RETURN QUERY 
    SELECT ROW_NUMBER() OVER (ORDER BY rm.updated_on DESC)::integer AS sl_no,
           rm.resume_id,
           rm.user_id,
           rm.resume_title,
           COALESCE('Template-00' || rm.template_id, 'Template-001')::varchar AS template_name,
           rm.updated_on
    FROM public.resume_master rm
    WHERE rm.user_id = par_user_id AND rm.record_status = 1
    ORDER BY rm.updated_on DESC;
END;
$$ LANGUAGE plpgsql;

-- Get Profile Details Function
CREATE OR REPLACE FUNCTION public.get_my_profile_details(par_user_id bigint)
RETURNS TABLE(user_id bigint, name varchar, email varchar, mobile varchar) AS $$
BEGIN
    RETURN QUERY
    SELECT u.user_id, u.full_name AS name, u.email, u.mobile
    FROM public.users u
    WHERE u.user_id = par_user_id;
END;
$$ LANGUAGE plpgsql;

-- Save Resume Custom Sections Function
CREATE OR REPLACE FUNCTION public.save_resume_custom_sections_json(
    p_resume_id bigint,
    p_custom_sections_json jsonb
)
RETURNS boolean AS $$
DECLARE
    v_item jsonb;
    v_order int := 1;
BEGIN
    DELETE FROM public.resume_custom_sections WHERE resume_id = p_resume_id;

    IF p_custom_sections_json IS NOT NULL AND jsonb_typeof(p_custom_sections_json) = 'array' THEN
        FOR v_item IN SELECT * FROM jsonb_array_elements(p_custom_sections_json) LOOP
            INSERT INTO public.resume_custom_sections (
                resume_id,
                section_title,
                section_data,
                display_order,
                created_on
            ) VALUES (
                p_resume_id,
                COALESCE(v_item->>'section_title', 'Custom Section'),
                COALESCE(v_item->'section_data', v_item),
                COALESCE((v_item->>'display_order')::int, v_order),
                CURRENT_TIMESTAMP
            );
            v_order := v_order + 1;
        END LOOP;
    END IF;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Get Single Unified Editor Data Function
CREATE OR REPLACE FUNCTION public.get_resume_for_editor(
    p_resume_id bigint,
    p_user_id bigint
)
RETURNS json AS $$
DECLARE
    v_resume record;
    v_personal json;
    v_education json;
    v_experience json;
    v_skills json;
    v_projects json;
    v_certifications json;
    v_languages json;
    v_custom json;
    v_status json;
    v_result json;
BEGIN
    SELECT * INTO v_resume 
    FROM public.resume_master 
    WHERE resume_id = p_resume_id AND record_status = 1;

    IF NOT FOUND THEN
        RETURN json_build_object('error', 'Resume not found');
    END IF;

    SELECT row_to_json(p) INTO v_personal
    FROM (
        SELECT * FROM public.resume_personal WHERE resume_id = p_resume_id AND record_status = 1 LIMIT 1
    ) p;

    SELECT COALESCE(json_agg(row_to_json(e)), '[]'::json) INTO v_education
    FROM (
        SELECT * FROM public.resume_education WHERE resume_id = p_resume_id AND record_status = 1 ORDER BY start_year DESC NULLS LAST
    ) e;

    SELECT COALESCE(json_agg(row_to_json(x)), '[]'::json) INTO v_experience
    FROM (
        SELECT * FROM public.resume_experience WHERE resume_id = p_resume_id AND record_status = 1 ORDER BY currently_working DESC, start_date DESC NULLS LAST
    ) x;

    SELECT COALESCE(json_agg(row_to_json(s)), '[]'::json) INTO v_skills
    FROM (
        SELECT * FROM public.resume_skills WHERE resume_id = p_resume_id AND record_status = 1 ORDER BY skill_id ASC
    ) s;

    SELECT COALESCE(json_agg(row_to_json(pr)), '[]'::json) INTO v_projects
    FROM (
        SELECT * FROM public.resume_projects WHERE resume_id = p_resume_id AND record_status = 1 ORDER BY project_id ASC
    ) pr;

    SELECT COALESCE(json_agg(row_to_json(c)), '[]'::json) INTO v_certifications
    FROM (
        SELECT * FROM public.resume_certifications WHERE resume_id = p_resume_id AND record_status = 1 ORDER BY certification_id ASC
    ) c;

    SELECT COALESCE(json_agg(row_to_json(l)), '[]'::json) INTO v_languages
    FROM (
        SELECT * FROM public.resume_languages WHERE resume_id = p_resume_id AND record_status = 1 ORDER BY language_id ASC
    ) l;

    SELECT COALESCE(json_agg(row_to_json(cs)), '[]'::json) INTO v_custom
    FROM (
        SELECT custom_section_id, resume_id, section_title, section_data, display_order 
        FROM public.resume_custom_sections 
        WHERE resume_id = p_resume_id AND record_status = 1 
        ORDER BY display_order ASC, custom_section_id ASC
    ) cs;

    BEGIN
        v_status := public.get_resume_sections_status(p_resume_id);
    EXCEPTION WHEN OTHERS THEN
        v_status := '{"percentage": 100}'::json;
    END;

    SELECT json_build_object(
        'resume_id', v_resume.resume_id,
        'user_id', v_resume.user_id,
        'resume_title', v_resume.resume_title,
        'template_id', COALESCE(v_resume.template_id, 1),
        'upload_confidence', COALESCE(v_resume.upload_confidence, 100),
        'is_draft', COALESCE(v_resume.is_draft, true),
        'updated_on', v_resume.updated_on,
        'personal', COALESCE(v_personal, '{}'::json),
        'summary', COALESCE(v_personal->>'professional_summary', ''),
        'education', v_education,
        'experience', v_experience,
        'skills', v_skills,
        'projects', v_projects,
        'certifications', v_certifications,
        'languages', v_languages,
        'custom_sections', v_custom,
        'section_status', v_status
    ) INTO v_result;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql;
