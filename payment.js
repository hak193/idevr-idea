document.addEventListener('DOMContentLoaded', function() {
    // Initialize Stripe with your publishable key
    // In production, this key should be set via environment variables in cPanel
    const stripe = Stripe('pk_test_your_key');
    
    const paymentButton = document.getElementById('payment-button');
    const errorMessage = document.getElementById('error-message');
    const orderSummary = document.getElementById('orderSummary');

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

    function calculatePrice(appType, featuresCount) {
        const basePrices = {
            mobile: 2999,
            web: 2499,
            ecommerce: 3499
        };
        const featurePrice = 499;
        const basePrice = basePrices[appType] || 2499;
        return basePrice + (featurePrice * featuresCount);
    }

    // Load and display order summary
    function loadOrderSummary() {
        try {
            const appData = JSON.parse(localStorage.getItem('appBuilderData'));
            
            if (!appData) {
                window.location.href = 'builder.html';
                return;
            }

            const price = calculatePrice(appData.appType, appData.features.length);

            const summaryHTML = `
                <div class="space-y-6">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-800">App Details</h3>
                        <div class="mt-3 space-y-4">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-3">
                                    <i class="fas ${getAppTypeIcon(appData.appType)} text-blue-600"></i>
                                    <span class="text-gray-600">${appData.appName}</span>
                                </div>
                                <span class="text-gray-800 font-semibold">$${price.toLocaleString()}</span>
                            </div>
                            <p class="text-gray-600">${appData.appDescription}</p>
                        </div>
                    </div>
                    ${appData.features.length > 0 ? `
                        <div>
                            <h3 class="text-lg font-semibold text-gray-800">Selected Features</h3>
                            <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                                ${appData.features.map(feature => `
                                    <div class="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                                        <i class="fas ${getFeatureIcon(feature)} text-blue-600"></i>
                                        <span class="text-gray-600">${formatFeatureName(feature)}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    <div class="border-t pt-4 mt-6">
                        <div class="flex items-center justify-between text-lg">
                            <span class="font-semibold text-gray-800">Total Amount</span>
                            <span class="font-bold text-blue-600">$${price.toLocaleString()}</span>
                        </div>
                        <p class="mt-2 text-sm text-gray-500">
                            Includes all features and development costs
                        </p>
                    </div>
                </div>
            `;

            orderSummary.innerHTML = summaryHTML;
        } catch (error) {
            console.error('Error loading order summary:', error);
            window.location.href = 'builder.html';
        }
    }

    // Handle payment button click
    paymentButton.addEventListener('click', async function() {
        try {
            const appData = JSON.parse(localStorage.getItem('appBuilderData'));
            const price = calculatePrice(appData.appType, appData.features.length);

            // Show loading state
            paymentButton.disabled = true;
            paymentButton.innerHTML = `
                <i class="fas fa-spinner fa-spin"></i>
                <span>Processing...</span>
            `;

            // For demo purposes, we'll show a success message
            // In production, this would make an actual API call to Stripe
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'p-4 bg-green-50 text-green-600 rounded-lg mb-4';
            successMessage.innerHTML = `
                <div class="flex items-center space-x-2">
                    <i class="fas fa-check-circle text-xl"></i>
                    <div>
                        <h4 class="font-semibold">Demo Payment Successful!</h4>
                        <p class="text-sm">Thank you for testing our payment system.</p>
                        <p class="text-sm mt-2">In production, this would integrate with Stripe Checkout.</p>
                    </div>
                </div>
            `;

            // Insert success message before the payment button
            paymentButton.parentNode.insertBefore(successMessage, paymentButton);

            // Update button state
            paymentButton.innerHTML = `
                <i class="fas fa-check"></i>
                <span>Payment Complete</span>
            `;
            paymentButton.className = 'w-full py-3 px-6 bg-green-600 text-white rounded-lg cursor-not-allowed';

            // Redirect to success page after a delay
            setTimeout(() => {
                window.location.href = 'success.html';
            }, 2000);

        } catch (error) {
            console.error('Payment error:', error);
            errorMessage.textContent = error.message || 'An error occurred during payment. Please try again.';
            errorMessage.classList.remove('hidden');
            
            // Reset button state
            paymentButton.disabled = false;
            paymentButton.innerHTML = `
                <i class="fas fa-lock"></i>
                <span>Pay Now</span>
            `;
        }
    });

    // Initialize page
    loadOrderSummary();
});