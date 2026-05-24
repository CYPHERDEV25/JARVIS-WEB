-- PostgreSQL 15+ requires explicit public schema permissions
-- Runs only on first database init (new Docker volume)

ALTER DATABASE jarvis OWNER TO jarvis;

\c jarvis

ALTER SCHEMA public OWNER TO jarvis;
GRANT ALL ON SCHEMA public TO jarvis;
GRANT CREATE ON SCHEMA public TO jarvis;
GRANT USAGE ON SCHEMA public TO PUBLIC;
GRANT CREATE ON SCHEMA public TO PUBLIC;
