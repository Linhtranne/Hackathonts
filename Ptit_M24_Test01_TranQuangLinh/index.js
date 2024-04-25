"use strict";
class Feedback {
    constructor(id, name, score, message) {
        this.id = id;
        this.name = name;
        this.score = score;
        this.message = message;
    }
}
class FeedbackManager {
    constructor() {
        const savedFeedbacks = localStorage.getItem('feedbacks');
        this.feedbacks = savedFeedbacks ? JSON.parse(savedFeedbacks) : [];
    }
    renderFeedback() {
        const feedbackContainer = document.getElementById('feedback-container');
        feedbackContainer.innerHTML = '';
        this.feedbacks.forEach((feedback) => {
            const feedbackDiv = document.createElement('div');
            feedbackDiv.classList.add('feedback-item');
            feedbackDiv.innerHTML = `
              <p>${feedback.name} - Score: ${feedback.score}</p>
              <p>${feedback.message}</p>
              <span class="edit-feedback" data-id="${feedback.id}"><i class="fa-solid fa-edit"></i></span>
              <span class="delete-feedback" data-id="${feedback.id}"><i class="fa-solid fa-trash-alt"></i></span>
          `;
            feedbackContainer.appendChild(feedbackDiv);
        });
    }
    createFeedback(name, score, message) {
        const id = new Date().getTime();
        const newFeedback = new Feedback(id, name, score, message);
        this.feedbacks.push(newFeedback);
        this.saveFeedbacks();
        this.renderFeedback();
    }
    updateFeedback(id, name, score, message) {
        const index = this.feedbacks.findIndex((feedback) => feedback.id === id);
        if (index !== -1) {
            this.feedbacks[index].name = name;
            this.feedbacks[index].score = score;
            this.feedbacks[index].message = message;
            this.saveFeedbacks();
            this.renderFeedback();
        }
    }
    deleteFeedback(id) {
        const index = this.feedbacks.findIndex((feedback) => feedback.id === id);
        if (index !== -1) {
            this.feedbacks.splice(index, 1);
            this.saveFeedbacks();
            this.renderFeedback();
        }
    }
    saveFeedbacks() {
        localStorage.setItem('feedbacks', JSON.stringify(this.feedbacks));
    }
}
const feedbackManager = new FeedbackManager();
document.getElementById('feedback-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const score = parseInt(document.querySelector('input[name="satisfy"]:checked').value);
    const message = document.getElementById('msg').value;
    feedbackManager.createFeedback(name, score, message);
    event.target.reset();
});
document.getElementById('feedback-container').addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-feedback')) {
        const id = (event.target.getAttribute('data-id'));
        if (confirm('sửa à?')) {
            feedbackManager.deleteFeedback(id);
        }
    }
    document.getElementById('feedback-container').addEventListener('click', (event) => {
        if (event.target.classList.contains('edit-feedback')) {
            const id = (event.target.getAttribute('data-id'));
            const feedback = feedbackManager.feedbacks.find((item) => item.id.toString() === id);
            if (feedback) {
                document.getElementById('name').value = feedback.name;
                const scoreInput = document.querySelector(`input[name="satisfy"][value="${feedback.score}"]`);
                if (scoreInput) {
                    scoreInput.checked = true;
                }
                document.getElementById('msg').value = feedback.message;
                const submitBtn = document.getElementById('submit-btn');
                submitBtn.textContent = 'Update';
                submitBtn.setAttribute('data-id', id.toString());
            }
        }
    });
    document.getElementById('submit-btn').addEventListener('click', (event) => {
        const id = (event.target.getAttribute('data-id'));
        if (id) {
            const name = document.getElementById('name').value;
            const score = parseInt(document.querySelector('input[name="satisfy"]:checked').value);
            const message = document.getElementById('msg').value;
            feedbackManager.updateFeedback(id, name, score, message);
            event.target.textContent = 'Send';
            event.target.removeAttribute('data-id');
            document.getElementById('feedback-form').reset();
        }
    });
});
