 ```javascript
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('builderForm');
    const previewBtn = document.getElementById('previewBtn');
    const previewContent = document.getElementById('previewContent');

    // Function to update preview
    function updatePreview() {
        const appName = document.getElementById('appName').value;
        const appDescription = document.getElementById('appDescription').value;
        const appType = document.querySelector('input[name="appType"]:checked')?.value;
        const selectedFeatures = Array.from(document.querySelectorAll('input[name="features"]:checked'))
            .map(checkbox => checkbox.value);

        // Create preview content
        let previewHTML = `
            <div class="space-y-6">
                ${appName ? `<div><h3 class="text-lg font-semibold text-gray-800">App Name</h3><p class="text-gray-600">${appName}</p></div>` : ''}
                ${appDescription ? `<div><h3 class="text-lg font-semibold text-gray-800">Description</h3><p class="text-gray-600">${appDescription}</p></div>` : ''}
                ${appType ? `<div><h3 class="text-lg font-semibold text-gray-800">Type</h3><p class="text-gray-600">${capitalizeFirstLetter(appType)} App</p></div>` : ''}
                ${selectedFeatures.length > 0 ? `<div><h3 class="text-lg font-semibold text-gray-800">Selected Features</h3><p class="text-gray-600">${selectedFeatures.join(', ')}</p></div>` : ''}
            </div>
        `;

        previewContent.innerHTML = previewHTML;
    }

    // Event listeners
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the default form submission

        // Validate form
        if (!form.checkValidity()) {
            return;
        }

        // Collect form data
        const formData = {
            appName: document.getElementById('appName').value,
            appDescription: document.getElementById('appDescription').value,
            appType: document.querySelector('input[name="appType"]:checked').value,
            features: Array.from(document.querySelectorAll('input[name="features"]:checked'))
                .map(checkbox => checkbox.value)
        };

        // Store form data in localStorage for payment page
        localStorage.setItem('appBuilderData', JSON.stringify(formData));

        // Redirect to payment page
        window.location.href = 'payment.html';
    });

    previewBtn.addEventListener('click', updatePreview);
});
