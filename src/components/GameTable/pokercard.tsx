import React from 'react';
import questions from '../../assets/questions'

const getRandomQuest = () => {
    const getRandom = (min:number, max:number) => Math.floor(Math.random() * (max - min + 1)) + min;
    return JSON.parse(JSON.stringify(questions[getRandom(0, questions.length - 1)]));
};

export default getRandomQuest();