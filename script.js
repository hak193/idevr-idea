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

        // If no data entered yet, show default message
        if (!appName && !appDescription && !appType && selectedFeatures.length === 0) {
            previewContent.innerHTML = `
                <div class="p-4 bg-gray-50 rounded-lg">
                    <p class="text-gray-500 text-center">Fill out the form to see your app preview</p>
                </div>
            `;
            return;
        }

        // Create preview content
        let previewHTML = `
            <div class="space-y-6">
                ${appName ? `
                    <div>
                        <h3 class="text-lg font-semibold text-gray-800">App Name</h3>
                        <p class="text-gray-600">${appName}</p>
                    </div>
                ` : ''}
                
                ${appDescription ? `
                    <div>
                        <h3 class="text-lg font-semibold text-gray-800">Description</h3>
                        <p class="text-gray-600">${appDescription}</p>
                    </div>
                ` : ''}
                
                ${appType ? `
                    <div>
                        <h3 class="text-lg font-semibold text-gray-800">Type</h3>
                        <div class="flex items-center space-x-2">
                            <i class="fas ${getAppTypeIcon(appType)} text-blue-600"></i>
                            <span class="text-gray-600">${capitalizeFirstLetter(appType)} App</span>
                        </div>
                    </div>
                ` : ''}
                
                ${selectedFeatures.length > 0 ? `
                    <div>
                        <h3 class="text-lg font-semibold text-gray-800">Selected Features</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                            ${selectedFeatures.map(feature => `
                                <div class="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                                    <i class="fas ${getFeatureIcon(feature)} text-blue-600"></i>
                                    <span class="text-gray-600">${formatFeatureName(feature)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                ${appName && appDescription && appType ? `
                    <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-2">
                                <i class="fas fa-info-circle text-blue-600"></i>
                                <span class="text-blue-600 font-semibold">Estimated Development Time</span>
                            </div>
                            <span class="text-blue-600 font-semibold">${calculateEstimatedTime(selectedFeatures.length)} weeks</span>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;

        previewContent.innerHTML = previewHTML;
    }

    // Helper functions
    function getAppTypeIcon(type) {
        const icons = {
            mobile: 'fa-mobile-alt',
            web: 'fa-laptop',
            ecommerce: 'fa-shopping-cart'
        };
        return icons[type] || 'fa-code';
    }

    function getFeatureIcon(feature) {
        const icons = {
            authentication: 'fa-user-lock',
            payments: 'fa-credit-card',
            notifications: 'fa-bell',
            analytics: 'fa-chart-line',
            social: 'fa-share-alt',
            realtime: 'fa-sync'
        };
        return icons[feature] || 'fa-star';
    }

    function formatFeatureName(feature) {
        const names = {
            authentication: 'User Authentication',
            payments: 'Payment Integration',
            notifications: 'Push Notifications',
            analytics: 'Analytics Dashboard',
            social: 'Social Integration',
            realtime: 'Real-time Updates'
        };
        return names[feature] || feature;
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function calculateEstimatedTime(featuresCount) {
        // Base time of 4 weeks + 1 week per feature
        return 4 + featuresCount;
    }

    // Event listeners
    form.addEventListener('input', updatePreview);
    previewBtn.addEventListener('click', updatePreview);

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
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

    // Initialize preview
    updatePreview();
});