const submitBtn = document.getElementById('submit_button');
const errorMsgHolder = document.getElementById('error-msgs');
const thankYouPage = document.getElementById('thankyou-page');
let version, feedbackFor;


errorMsgHolder.style.display = 'none';
let answers = {
    feedback: [],
    feedbackFor: ''
};

//global error handling
window.onerror = (e) => {
    const msg = e.replace('Uncaught ', '');
    errorMsgHolder.textContent = msg;
    errorMsgHolder.style.display = 'block';
    document.getElementById("error-msgs").scrollIntoView(true);
}

const generateFeedbackClob = () => {
    answers.feedback = [];

    if (document.getElementById('grid-first-name').value != '' &&
        document.getElementById('grid-last-name').value != '' &&
        document.getElementById('grid-empid').value != '' &&
        document.getElementById('grid-email').value != '' &&
        document.getElementById('grid-business-line').value != '' &&
        document.getElementById('grid-location').value != '') {
        answers.feedback.push(
            {
                "firstName": document.getElementById('grid-first-name').value,
                "lastName": document.getElementById('grid-last-name').value,
                "employeeID": document.getElementById('grid-empid').value,
                "email": document.getElementById('grid-email').value,
                "businessLine": document.getElementById('grid-business-line').value,
                "location": document.getElementById('grid-location').value
            });

        /* answers.feedback.push(document.getElementById('grid-first-name').value);  
        answers.feedback.push(document.getElementById('grid-last-name').value);
        answers.feedback.push(document.getElementById('grid-empid').value);
        answers.feedback.push(document.getElementById('grid-email').value);
        answers.feedback.push(document.getElementById('grid-business-line').value);
        answers.feedback.push(document.getElementById('grid-location').value); */
    }
}

const validateFields = () => {
    errorMsgHolder.style.display = 'none';
    generateFeedbackClob();
    var count = 0;
    for (var c in answers.feedback[0]) {
        count = count + 1;
    }
    if (count < 6) {
        throw ('All answers are mandatory')
    }
}

submitBtn.addEventListener('click', () => {
    validateFields();
    fetch('/submitFeedback', {
        method: 'post',
        body: JSON.stringify(answers),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(resp => {
        resp.json().then(r => {
            if (r.status == 'SUCCESS') {
                localStorage.setItem('feedback_version', version);
                localStorage.setItem('feedback_id', r.feedback_id);
                thankYouPage.style.display = 'block';
            }
        })
    });
});

fetch('/getconfig').then(res => {
    return res.json();
}).then(res => {
    let submittedVersion = localStorage.getItem('feedback_version');
    let courseNameHolder = document.getElementById('course_name');
    let courseNameTableHolder = document.getElementById('course_name_table');
    let courseDateHolder = document.getElementById('course_date');
    let courseTrainersHolder = document.getElementById('course_trainers');
    let thankYouMsgCourseName = document.getElementById('thank-you-course-name');
    version = res.version;
    if (submittedVersion === version) {
        thankYouPage.style.display = 'block';
    }
    answers.feedbackFor = res.feedback_for;
    courseNameHolder.textContent = res.name;
    courseNameTableHolder.textContent = res.name;
    thankYouMsgCourseName.textContent = res.name;
    courseDateHolder.textContent = res.date;
    courseTrainersHolder.textContent = res.trainers;
    document.title = res.name + ' | ' + document.title;
});