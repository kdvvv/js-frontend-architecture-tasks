// BEGIN
export default function app(companies) {
    const container = document.querySelector('.container');

    let currentDescriptionElement = null;

    companies.forEach((company) => {
        const button = document.createElement('button');
        button.classList.add('btn', 'btn-primary', 'm-1');
        button.textContent = company.name;
        container.appendChild(button);

        button.addEventListener('click', () => {
            if (currentDescriptionElement && currentDescriptionElement.textContent === company.description) {
                currentDescriptionElement.remove();
                currentDescriptionElement = null;
                return;
            }

            if (currentDescriptionElement) {
                currentDescriptionElement.remove();
            }

            const description = document.createElement('div');
            description.textContent = company.description;
            container.appendChild(description);
            currentDescriptionElement = description;
        });
    });
}
// END