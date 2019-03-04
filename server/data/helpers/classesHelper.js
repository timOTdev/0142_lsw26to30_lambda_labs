const db = require('../../config/dbConfig');

module.exports = {
  getAll: async () => {
    const allClasses = await db('classes');
    return allClasses;
  },

  getClass: async id => {
    const selectedClass = await db('classes')
      .where({ id })
      .first();

    const teacher = await db('teachers')
      .select(
        'teachers.id as t_id',
        'teachers.first_name as t_first',
        'teachers.last_name as t_last',
        'teachers.email as t_email'
      )
      .join('teachers_classes_refreshrs as tcr', 'teachers.user_id', 'tcr.teacher_id')
      .join('classes', 'classes.id', 'tcr.class_id') 
      .where('classes.id', id);

    const students = await db('students')
      .join('students_classes', 'students.id', 'students_classes.student_id')
      .join('classes', 'classes.id', 'students_classes.class_id') 
      .where('classes.id', id);

    const refreshrs = await db('refreshrs')
      .select(
        'refreshrs.id',
        'refreshrs.name as r_name',
        'refreshrs.review_text',
        'questions.id as question_id',
        'questions.question',
        'questions.wrong_answer_1',
        'questions.wrong_answer_2',
        'questions.wrong_answer_3',
        'questions.correct_answer',
      )
      .join(
        'questions_refreshrs',
        'refreshrs.id',
        'questions_refreshrs.refreshr_id'
      )
      .join('questions', 'questions.id', 'questions_refreshrs.question_id')
      .join('teachers_classes_refreshrs as tcr', 'refreshrs.id', 'tcr.refreshr_id')
      .join('classes', 'classes.id', 'tcr.refreshr_id')
      .where('classes.id', id);

    return Promise.all([selectedClass, teacher, students, refreshrs]).then(
      response => {
        let [selectedClass, teacher, students, refreshrs] = response;
        let result = {
          id: selectedClass.id,
          name: selectedClass.name,
          teacher: teacher.map(t => {
            return {
              teacher_id: t.t_id,
              name: `${t.t_first} ${t.t_last}`,
              email: t.t_email
            };
          }),
          students: students.map(s => {
            return {
              student_id: s.student_id,
              name: `${s.first_name} ${s.last_name}`,
              email: s.email
            };
          }),
          refreshrs: refreshrs.map(r => {
            return {
              refreshr_id: r.id,
              name: r.r_name,
              review_text: r.review_text,
              refreshr: {
                question_id: r.question_id,
                question: r.question,
                wrong_answer_1: r.wrong_answer_1,
                wrong_answer_2: r.wrong_answer_2,
                wrong_answer_3: r.wrong_answer_3,
                correct_answer: r.correct_answer,
              }
            };
          })
        };
        return result;
      }
    );
  },

  addClass: async classInfo => {
    const newClassID = await db('classes')
      .insert(classInfo)
      .returning('id')
      .then(id => {
        return id;
      });
    return newClassID[0];
  },
  
  updateClass: async (id, updatedClass) => {
    const updateCount = await db('classes')
      .where({ id })
      .update(updatedClass);
    return updateCount;
  },

  deleteClass: async id => {
    const deleteCount = await db('classes')
      .where({ id })
      .del();
    return deleteCount;
  },
  
  addStudent: async (class_id, student_id) => {
    const ID = await db('students_classes').insert({class_id, student_id});
    return ID[0];
  },


  removeStudent: (class_id, student_id) =>
    {
      return db('students_classes')
        .where({class_id, student_id })
        .delete();
    },
};
