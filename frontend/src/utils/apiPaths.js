export const API_BASE_URL = 'http://localhost:5000';

export const API_PATHS = {
    AUTH: {
        SIGNUP: `/api/auth/register`,
        LOGIN: `/api/auth/login`,
        GET_PROFILE: `/api/auth/profile`,
        UPLOAD_IMAGE: `/api/auth/upload-image`,
    },
    TASKS:{
        GET_DASHBOARD_DATA: `/api/tasks/dashboard-data`,
    }
}