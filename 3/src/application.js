// BEGIN
export default function app(laptops) {
    const form = document.querySelector('form');
    const resultDiv = document.querySelector('.result');

    const render = (filteredLaptops) => {
        resultDiv.innerHTML = '';
        if (filteredLaptops.length > 0) {
            const ul = document.createElement('ul');
            filteredLaptops.forEach(laptop => {
                const li = document.createElement('li');
                li.textContent = laptop.model;
                ul.appendChild(li);
            });
            resultDiv.appendChild(ul);
        }
    };

    const filterLaptops = () => {
        const formData = new FormData(form);
        const filters = {
            processor: formData.get('processor_eq'),
            memory: formData.get('memory_eq'),
            frequencyMin: parseFloat(formData.get('frequency_gte')) || 0,
            frequencyMax: parseFloat(formData.get('frequency_lte')) || Infinity,
        };

        const filteredLaptops = laptops.filter(laptop => {
            return [
                !filters.processor || laptop.processor === filters.processor,
                !filters.memory || laptop.memory === parseInt(filters.memory),
                laptop.frequency >= filters.frequencyMin,
                laptop.frequency <= filters.frequencyMax,
            ].every(Boolean);
        });

        render(filteredLaptops);
    };

    form.addEventListener('input', filterLaptops);
    form.addEventListener('change', filterLaptops);

    render(laptops);
}
// END