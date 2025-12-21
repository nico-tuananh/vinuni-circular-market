// Terms of Service Page Component
export class TermsOfServicePage {
    constructor() {
        this.container = document.getElementById('main-content');
    }

    render() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="container py-5">
                <div class="row justify-content-center">
                    <div class="col-lg-10">
                        <!-- Header Section -->
                        <div class="text-center mb-5">
                            <h1 class="display-4 fw-bold mb-3">Terms of Service</h1>
                            <p class="lead text-muted">
                                Last updated: January 2025
                            </p>
                        </div>

                        <!-- Introduction -->
                        <div class="card shadow-custom mb-4">
                            <div class="card-body p-4 p-md-5">
                                <h2 class="h4 mb-3">1. Acceptance of Terms</h2>
                                <p class="mb-3">
                                    By accessing and using CampusCircle, you accept and agree to be bound by the terms and 
                                    provision of this agreement. If you do not agree to abide by the above, please do not 
                                    use this service.
                                </p>
                                <p class="mb-0">
                                    CampusCircle is a student-exclusive marketplace platform operated for the VinUni community. 
                                    These Terms of Service govern your use of our platform and services.
                                </p>
                            </div>
                        </div>

                        <!-- Eligibility -->
                        <div class="card shadow-custom mb-4">
                            <div class="card-body p-4 p-md-5">
                                <h2 class="h4 mb-3">2. Eligibility</h2>
                                <p class="mb-3">
                                    To use CampusCircle, you must:
                                </p>
                                <ul class="mb-0">
                                    <li>Be a current student, faculty member, or staff member of VinUniversity</li>
                                    <li>Have a valid VinUni email address (@vinuni.edu.vn)</li>
                                    <li>Be at least 18 years old</li>
                                    <li>Provide accurate and complete information during registration</li>
                                    <li>Maintain the security of your account credentials</li>
                                </ul>
                            </div>
                        </div>

                        <!-- User Responsibilities -->
                        <div class="card shadow-custom mb-4">
                            <div class="card-body p-4 p-md-5">
                                <h2 class="h4 mb-3">3. User Responsibilities</h2>
                                <p class="mb-3">As a user of CampusCircle, you agree to:</p>
                                <ul class="mb-3">
                                    <li>Provide accurate, current, and complete information</li>
                                    <li>Maintain and update your account information</li>
                                    <li>Use the platform only for lawful purposes</li>
                                    <li>Respect other users and their property</li>
                                    <li>Not engage in fraudulent, deceptive, or harmful activities</li>
                                    <li>Not list prohibited items (weapons, illegal substances, etc.)</li>
                                    <li>Honor all transactions and agreements made through the platform</li>
                                </ul>
                                <p class="mb-0">
                                    You are solely responsible for all activities that occur under your account.
                                </p>
                            </div>
                        </div>

                        <!-- Transactions -->
                        <div class="card shadow-custom mb-4">
                            <div class="card-body p-4 p-md-5">
                                <h2 class="h4 mb-3">4. Transactions and Payments</h2>
                                <p class="mb-3">
                                    CampusCircle facilitates connections between buyers and sellers but is not a party to any 
                                    transaction. All transactions are between users directly.
                                </p>
                                <ul class="mb-0">
                                    <li>Users are responsible for negotiating terms, prices, and payment methods</li>
                                    <li>CampusCircle does not process payments or handle funds</li>
                                    <li>Users must resolve disputes directly with each other</li>
                                    <li>For lending transactions, users must return borrowed items by the agreed due date</li>
                                    <li>Failure to return borrowed items may result in account suspension</li>
                                </ul>
                            </div>
                        </div>

                        <!-- Prohibited Items -->
                        <div class="card shadow-custom mb-4">
                            <div class="card-body p-4 p-md-5">
                                <h2 class="h4 mb-3">5. Prohibited Items and Activities</h2>
                                <p class="mb-3">You may not list or trade the following items:</p>
                                <ul class="mb-3">
                                    <li>Weapons, firearms, or dangerous items</li>
                                    <li>Illegal substances or drugs</li>
                                    <li>Stolen property</li>
                                    <li>Counterfeit or pirated goods</li>
                                    <li>Items that violate intellectual property rights</li>
                                    <li>Hazardous materials</li>
                                    <li>Live animals (except as permitted by university policy)</li>
                                </ul>
                                <p class="mb-0">
                                    Violation of these restrictions may result in immediate account termination and 
                                    reporting to university authorities.
                                </p>
                            </div>
                        </div>

                        <!-- Content and Listings -->
                        <div class="card shadow-custom mb-4">
                            <div class="card-body p-4 p-md-5">
                                <h2 class="h4 mb-3">6. Content and Listings</h2>
                                <p class="mb-3">
                                    You retain ownership of content you post, but grant CampusCircle a license to use, 
                                    display, and distribute your content on the platform.
                                </p>
                                <ul class="mb-0">
                                    <li>You are responsible for the accuracy of your listings</li>
                                    <li>Listings must include accurate descriptions and photos</li>
                                    <li>CampusCircle reserves the right to remove any content that violates these terms</li>
                                    <li>You may not post spam, duplicate listings, or misleading information</li>
                                </ul>
                            </div>
                        </div>

                        <!-- Account Termination -->
                        <div class="card shadow-custom mb-4">
                            <div class="card-body p-4 p-md-5">
                                <h2 class="h4 mb-3">7. Account Termination</h2>
                                <p class="mb-3">
                                    CampusCircle reserves the right to suspend or terminate your account at any time for:
                                </p>
                                <ul class="mb-3">
                                    <li>Violation of these Terms of Service</li>
                                    <li>Fraudulent or deceptive behavior</li>
                                    <li>Harassment or abuse of other users</li>
                                    <li>Failure to honor transactions</li>
                                    <li>No longer being affiliated with VinUniversity</li>
                                </ul>
                                <p class="mb-0">
                                    You may also terminate your account at any time by contacting us or using account 
                                    settings, subject to completing any pending transactions.
                                </p>
                            </div>
                        </div>

                        <!-- Limitation of Liability -->
                        <div class="card shadow-custom mb-4">
                            <div class="card-body p-4 p-md-5">
                                <h2 class="h4 mb-3">8. Limitation of Liability</h2>
                                <p class="mb-3">
                                    CampusCircle is provided "as is" without warranties of any kind. We do not guarantee:
                                </p>
                                <ul class="mb-3">
                                    <li>The accuracy or completeness of listings</li>
                                    <li>The quality, safety, or legality of items listed</li>
                                    <li>The ability of users to complete transactions</li>
                                    <li>Uninterrupted or error-free service</li>
                                </ul>
                                <p class="mb-0">
                                    CampusCircle shall not be liable for any indirect, incidental, or consequential damages 
                                    arising from your use of the platform.
                                </p>
                            </div>
                        </div>

                        <!-- Changes to Terms -->
                        <div class="card shadow-custom mb-4">
                            <div class="card-body p-4 p-md-5">
                                <h2 class="h4 mb-3">9. Changes to Terms</h2>
                                <p class="mb-0">
                                    CampusCircle reserves the right to modify these Terms of Service at any time. 
                                    We will notify users of significant changes via email or platform notifications. 
                                    Continued use of the platform after changes constitutes acceptance of the new terms.
                                </p>
                            </div>
                        </div>

                        <!-- Contact -->
                        <div class="card shadow-custom">
                            <div class="card-body p-4 p-md-5">
                                <h2 class="h4 mb-3">10. Contact Information</h2>
                                <p class="mb-3">
                                    If you have questions about these Terms of Service, please contact us:
                                </p>
                                <p class="mb-0">
                                    <strong>Email:</strong> 
                                    <a href="mailto:campuscircle@vinuni.edu.vn">campuscircle@vinuni.edu.vn</a><br>
                                    <strong>Address:</strong> VinUniversity, Vinhomes Ocean Park, Gia Lam Ward, Hanoi, Vietnam
                                </p>
                            </div>
                        </div>

                        <!-- Back Button -->
                        <div class="text-center mt-5">
                            <button class="btn btn-primary" onclick="window.App.router.navigate('/')">
                                <i class="bi bi-arrow-left me-2"></i>Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}