const axios = require('axios');

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';
const api = axios.create({ baseURL: BASE_URL });

api.interceptors.response.use(
    (res) => res,
    (err) => Promise.resolve(err.response),
);

const DEPARTMENT_ID = 1;
const GROUP_ID = 1;

async function createTeacher() {
    const ts = Date.now();
    const res = await api.post('/teachers', {
        name: `TName${ts}`,
        surname: `TSurname${ts}`,
        patronymic: `TPatron${ts}`,
        position: 'доцент',
        department: { id: DEPARTMENT_ID },
    });
    return res.data.id;
}

async function createSubject() {
    const res = await api.post('/subjects', { name: `Subject${Date.now()}` });
    return res.data.id;
}

describe('Lessons API', () => {
    let teacherId;
    let subjectId;
    let lessonId;

    beforeAll(async () => {
        teacherId = await createTeacher();
        subjectId = await createSubject();
    });

    afterAll(async () => {
        if (teacherId) await api.delete(`/teachers/${teacherId}`);
        if (subjectId) await api.delete(`/subjects/${subjectId}`);
    });

    describe('GET /lessons', () => {
        it('should return 200 and an array', async () => {
            const res = await api.get('/lessons');
            expect(res.status).toBe(200);
            expect(Array.isArray(res.data)).toBe(true);
        });
    });

    describe('POST /lessons', () => {
        it('should create a lesson and return 201 with id', async () => {
            const res = await api.post('/lessons', {
                hours: 2,
                lessonType: 'LECTURE',
                subjectForSite: 'Test Subject',
                teacherForSite: 'Test Teacher',
                teacher: { id: teacherId },
                subject: { id: subjectId },
                group: { id: GROUP_ID },
            });
            expect(res.status).toBe(201);
            expect(res.data).toHaveProperty('id');
            lessonId = res.data.id;
        });

        it('should return 400 when teacher is missing', async () => {
            const res = await api.post('/lessons', {
                hours: 2,
                lessonType: 'LECTURE',
                subjectForSite: 'Test',
                teacherForSite: 'Test',
                subject: { id: subjectId },
                group: { id: GROUP_ID },
            });
            expect(res.status).toBe(400);
        });

        it('should return 400 when subject is missing', async () => {
            const res = await api.post('/lessons', {
                hours: 2,
                lessonType: 'LECTURE',
                subjectForSite: 'Test',
                teacherForSite: 'Test',
                teacher: { id: teacherId },
                group: { id: GROUP_ID },
            });
            expect(res.status).toBe(400);
        });
    });

    describe('GET /lessons/:id', () => {
        it('should return 200 and lesson data for existing id', async () => {
            const res = await api.get(`/lessons/${lessonId}`);
            expect(res.status).toBe(200);
            expect(res.data).toHaveProperty('id', lessonId);
            expect(res.data).toHaveProperty('lessonType');
        });

        it('should return 404 for non-existing id', async () => {
            const res = await api.get('/lessons/999999');
            expect(res.status).toBe(404);
            expect(res.data).toHaveProperty('message');
        });
    });
});
