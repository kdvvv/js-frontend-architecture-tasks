// BEGIN
export default () => {
    const form = document.querySelector('form');
    const input = form.querySelector('input[name="number"]');
    const result = document.getElementById('result');
    const resetButton = form.querySelector('button[type="button"]');

    let sum = 0;

    const updateResult = () => {
        result.textContent = sum;
    };

    const resetForm = () => {
        form.reset();
        input.focus();
    };

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const value = parseInt(input.value, 10);
        if (!isNaN(value)) {
            sum += value;
            updateResult();
        }
        resetForm();
    });

    resetButton.addEventListener('click', () => {
        sum = 0;
        updateResult();
        resetForm();
    });

    input.focus();
};
// END