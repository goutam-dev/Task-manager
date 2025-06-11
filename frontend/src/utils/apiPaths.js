export const API_BASE_URL = 'http://localhost:5000';

export const API_PATHS = {
    AUTH: {
        SIGNUP: `/api/auth/register`,
        LOGIN: `/api/auth/login`,
        GET_PROFILE: `/api/auth/profile`,
        UPLOAD_IMAGE: `/api/auth/upload-image`,
    },
    TASKS:{
        GET_ADMIN_DASHBOARD_DATA: `/api/tasks/dashboard-data`,
        GET_USER_DASHBOARD_DATA: `/api/tasks/user-dashboard-data`,
        CREATE_TASK: "/api/tasks",
        GET_ALL_TASKS: "/api/tasks",
        GET_TASK_BY_ID: "/api/tasks/",
        UPDATE_TASK: "/api/tasks/",
        DELETE_TASK: "/api/tasks/",
    },
    USERS: {
        GET_ALL_USERS: "/api/users",
    },
    REPORTS: {
        EXPORT_TASKS: "/api/reports/export/tasks",
        EXPORT_USERS: "/api/reports/export/users"
    }
}