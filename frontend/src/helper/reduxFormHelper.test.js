import {setValueToTeacherForSiteHandler, setValueToSubjectForSiteHandler} from './reduxFormHelper';
import {getTeacherForSite} from './renderTeacher';

const teachers = [
    {id: 1, name: 'Іван', surname: 'Петренко', patronymic: 'Олексійович', position: 'доцент'},
    {id: 2, name: 'Марія', surname: 'Коваль', patronymic: 'Іванівна', position: 'асистент'},
];

const subjects = [
    {id: 1, name: 'Математика'},
    {id: 2, name: 'Фізика'},
];

describe('setValueToTeacherForSiteHandler', () => {
    it('should call setValue with teacher data when teacher is found', () => {
        const setValue = jest.fn();
        setValueToTeacherForSiteHandler(teachers, 1, setValue);
        expect(setValue).toHaveBeenCalledWith('teacherForSite', getTeacherForSite(teachers[0]));
    });

    it('should call setValue with empty string when teacher is not found', () => {
        const setValue = jest.fn();
        setValueToTeacherForSiteHandler(teachers, 999, setValue);
        expect(setValue).toHaveBeenCalledWith('teacherForSite', '');
    });

    it('should handle id passed as string by converting to number', () => {
        const setValue = jest.fn();
        setValueToTeacherForSiteHandler(teachers, '2', setValue);
        expect(setValue).toHaveBeenCalledWith('teacherForSite', getTeacherForSite(teachers[1]));
    });

    it('should call setValue with empty string when teachers array is empty', () => {
        const setValue = jest.fn();
        setValueToTeacherForSiteHandler([], 1, setValue);
        expect(setValue).toHaveBeenCalledWith('teacherForSite', '');
    });

    it('should call setValue with empty string when id does not match any teacher', () => {
        const setValue = jest.fn();
        setValueToTeacherForSiteHandler(teachers, 42, setValue);
        expect(setValue).toHaveBeenCalledWith('teacherForSite', '');
    });
});

describe('setValueToSubjectForSiteHandler', () => {
    it('should call setValue with subject name when subject is found', () => {
        const setValue = jest.fn();
        setValueToSubjectForSiteHandler(subjects, 1, setValue);
        expect(setValue).toHaveBeenCalledWith('subjectForSite', 'Математика');
    });

    it('should call setValue with empty string when subject is not found', () => {
        const setValue = jest.fn();
        setValueToSubjectForSiteHandler(subjects, 999, setValue);
        expect(setValue).toHaveBeenCalledWith('subjectForSite', '');
    });

    it('should handle subjectId passed as string by converting to number', () => {
        const setValue = jest.fn();
        setValueToSubjectForSiteHandler(subjects, '2', setValue);
        expect(setValue).toHaveBeenCalledWith('subjectForSite', 'Фізика');
    });

    it('should call setValue with empty string when subjects array is empty', () => {
        const setValue = jest.fn();
        setValueToSubjectForSiteHandler([], 1, setValue);
        expect(setValue).toHaveBeenCalledWith('subjectForSite', '');
    });

    it('should call setValue with empty string when subjectId does not match any subject', () => {
        const setValue = jest.fn();
        setValueToSubjectForSiteHandler(subjects, 42, setValue);
        expect(setValue).toHaveBeenCalledWith('subjectForSite', '');
    });
});
