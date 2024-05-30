import keyBy from 'lodash/keyBy.js';
import has from 'lodash/has.js';
import isEmpty from 'lodash/isEmpty.js';
import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';

const routes = {
  usersPath: () => '/users',
};

const schema = yup.object().shape({
  name: yup.string().trim().required(),
  email: yup.string().required('email must be a valid email').email(),
  password: yup.string().required().min(6),
  passwordConfirmation: yup.string()
    .required('password confirmation is a required field')
    .oneOf(
      [yup.ref('password'), null],
      'password confirmation does not match to password',
    ),
});

// Этот объект можно использовать для того, чтобы обрабатывать ошибки сети.
// Это необязательное задание, но крайне рекомендуем попрактиковаться.
const errorMessages = {
  network: {
    error: 'Network Problems. Try again.',
  },
};

// Используйте эту функцию для выполнения валидации.
// Выведите в консоль её результат, чтобы увидеть, как получить сообщения об ошибках.
const validate = (fields) => {
  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (e) {
    return keyBy(e.inner, 'path');
  }
};

// BEGIN
export default () => {
  const state = {
    form: {
      valid: false,
      processState: 'filling',
      fields: {
        name: '',
        email: '',
        password: '',
        passwordConfirmation: '',
      },
      errors: {},
    },
  };

  const watchedState = onChange(state, (path, value, previousValue) => {
    if (path === 'form.fields' || path.startsWith('form.fields')) {
      state.form.errors = validate(state.form.fields);
      state.form.valid = isEmpty(state.form.errors);
      const submitButton = document.querySelector('input[type="submit"]');
      submitButton.disabled = !state.form.valid;
      submitButton.style.cursor = state.form.valid ? 'pointer' : 'not-allowed';
      updateErrors();
    }
    if (path === 'form.processState' && value === 'submitted') {
      const container = document.querySelector('[data-container="sign-up"]');
      container.innerHTML = 'User Created!';
    }
  });

  const form = document.querySelector('[data-form="sign-up"]');
  const submitButton = form.querySelector('input[type="submit"]');

  form.addEventListener('input', (e) => {
    const { name, value } = e.target;
    watchedState.form.fields[name] = value;
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    watchedState.form.processState = 'sending';
    submitButton.disabled = true;
    submitButton.style.cursor = 'not-allowed';
    try {
      await axios.post(routes.usersPath(), watchedState.form.fields);
      watchedState.form.processState = 'submitted';
    } catch (error) {
      watchedState.form.processState = 'filling';
      console.error(errorMessages.network.error);
      submitButton.disabled = false;
      submitButton.style.cursor = 'pointer';
    }
  });

  const updateErrors = () => {
    const { errors } = state.form;
    Object.keys(errors).forEach((path) => {
      const input = form.querySelector(`[name="${path}"]`);
      input.classList.add('is-invalid');
      const errorMessage = errors[path].message;
      let feedback = input.nextElementSibling;
      if (!feedback || !feedback.classList.contains('invalid-feedback')) {
        feedback = document.createElement('div');
        feedback.classList.add('invalid-feedback');
        input.insertAdjacentElement('afterend', feedback);
      }
      feedback.textContent = errorMessage;
    });

    const inputs = form.querySelectorAll('input');
    inputs.forEach((input) => {
      const { name } = input;
      if (!has(errors, name)) {
        input.classList.remove('is-invalid');
        const feedback = input.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
          feedback.remove();
        }
      }
    });
  };

  updateErrors();
};

// END
