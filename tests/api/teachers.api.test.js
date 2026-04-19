const axios = require('axios');

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';
const api = axios.create({ baseURL: BASE_URL });

// Suppress axios throwing on non-2xx so we can assert manually
api.interceptors.response.use(
    (res) => res,
    (err) => Promise.resolve(err.response),
);

const DEPARTMENT_ID = 1;

function uniqueTeacher() {
    const ts = Date.now();
    return {
        name: `Name${ts}`,
        surname: `Surname${ts}`,
        patronymic: `Patron${ts}`,
        position: 'доцент',
        department: { id: DEPARTMENT_ID },
    };
}

describe('Teachers API', () => {
    let createdId;

    describe('GET /teachers', () => {
        it('should return 200 and an array', async () => {
            const res = await api.get('/teachers');
            expect(res.status).toBe(200);
            expect(Array.isArray(res.data)).toBe(true);
        });
    });

    describe('POST /teachers', () => {
        it('should create a teacher and return 201 with id', async () => {
            const res = await api.post('/teachers', uniqueTeacher());
            expect(res.status).toBe(201);
            expect(res.data).toHaveProperty('id');
            createdId = res.data.id;
        });

        it('should return 400 when name is missing', async () => {
            const res = await api.post('/teachers', {
                surname: 'Test',
                patronymic: 'Test',
                position: 'доцент',
                department: { id: DEPARTMENT_ID },
            });
            expect(res.status).toBe(400);
        });

        it('should return 400 when position is missing', async () => {
            const res = await api.post('/teachers', {
                name: 'Test',
                surname: 'Test',
                patronymic: 'Test',
                department: { id: DEPARTMENT_ID },
            });
            expect(res.status).toBe(400);
        });
    });

    describe('GET /teachers/:id', () => {
        it('should return 200 and teacher data for existing id', async () => {
            const res = await api.get(`/teachers/${createdId}`);
            expect(res.status).toBe(200);
            expect(res.data).toHaveProperty('id', createdId);
        });

        it('should return 404 for non-existing id', async () => {
            const res = await api.get('/teachers/999999');
            expect(res.status).toBe(404);
            expect(res.data).toHaveProperty('message');
        });
    });

    describe('PUT /teachers', () => {
        it('should update teacher and return 200', async () => {
            const updated = {
                id: createdId,
                name: 'UpdatedName',
                surname: 'UpdatedSurname',
                patronymic: 'UpdatedPat',
                position: 'професор',
                department: { id: DEPARTMENT_ID },
            };
            const res = await api.put('/teachers', updated);
            expect(res.status).toBe(200);
            expect(res.data.name).toBe('UpdatedName');
            expect(res.data.position).toBe('професор');
        });
    });

    describe('DELETE /teachers/:id', () => {
        it('should delete teacher and return 200', async () => {
            const res = await api.delete(`/teachers/${createdId}`);
            expect(res.status).toBe(200);
        });

        it('should return 404 after deletion', async () => {
            const res = await api.get(`/teachers/${createdId}`);
            expect(res.status).toBe(404);
        });

        it('should return 404 when deleting non-existing teacher', async () => {
            const res = await api.delete('/teachers/999999');
            expect(res.status).toBe(404);
        });
    });
});
