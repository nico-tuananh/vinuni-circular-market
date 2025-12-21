// Privacy Policy Page Component
export class PrivacyPolicyPage {
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
                            <h1 class="display-4 fw-bold mb-3">Privacy Policy</h1>
                            <p class="lead text-muted">
                                Last updated: January 2025
                            </p>
                        </div>

                        <!-- Introduction -->
                        <div class="card shadow-custom mb-4">
                            <div class="card-body p-4 p-md-5">
                                <h2 class="h4 mb-3">1. Introduction</h2>
                                <p class="mb-3">
                                    CampusCircle ("we," "our," or "us") is committed to protecting your privacy. This Privacy 
                                    Policy explains how we collect, use, disclose, and safeguard your information when you use 
                                    our student marketplace platform.
                                </p>
                                <p class="mb-0">
                                    By using CampusCircle, you consent to the data practices described in this policy. If you 
                                    do not agree with the practices described, please do not use our services.
                                </p>
                            </div>
                        </div>

                        <!-- Information We Collect -->
                        <div class="card shadow-custom mb-4">
                            <div class="card-body p-4 p-md-5">
                                <h2 class="h4 mb-3">2. Information We Collect</h2>
                                
                                <h5 class="mt-4 mb-3">Personal Information</h5>
                                <p class="mb-3">We collect information that you provide directly to us:</p>
                                <ul class="mb-4">
                                    <li><strong>Account Information:</strong> Full name, email address, phone number, address</li>
                                    <li><strong>Profile Information:</strong> Profile picture, bio, preferences</li>
                                    <li><strong>Listing Information:</strong> Item descriptions, photos, prices, location</li>
                                    <li><strong>Transaction Information:</strong> Purchase history, order details, communication records</li>
                                    <li><strong>Verification Information:</strong> VinUni email address for account verification</li>
                                </ul>

                                <h5 class="mb-3">Automatically Collected Information</h5>
                                <p class="mb-3">We automatically collect certain information when you use our platform:</p>
                                <ul class="mb-0">
                                    <li>Device information (IP address, browser type, operating system)</li>
                                    <li>Usage data (pages visited, time spent, features used)</li>
                                    <li>Cookies and similar tracking technologies</li>
                                    <li>Location data (if enabled and permitted)</li>
                                </ul>
                            </div>
                        </div>

                        <!-- How We Use Information -->
                        <div class="card shadow-custom mb-4">
                            <div class="card-body p-4 p-md-5">
                                <h2 class="h4 mb-3">3. How We Use Your Information</h2>
                                <p class="mb-3">We use the information we collect to:</p>
                                <ul class="mb-0">
                                    <li>Provide, maintain, and improve our services</li>
                                    <li>Process transactions and facilitate communication between users</li>
                                    <li>Verify your identity and VinUni affiliation</li>
                                    <li>Send you important updates, notifications, and service-related communications</li>
                                    <li>Respond to your inquiries and provide customer support</li>
                                    <li>Detect, prevent, and address technical issues and fraudulent activity</li>
                                    <li>Analyze usage patterns to improve user experience</li>
                                    <li>Comply with legal obligations and enforce our Terms of Service</li>
                                </ul>
                            </div>
                        </div>

                        <!-- Information Sharing -->
                        <div class="card shadow-custom mb-4">
                            <div class="card-body p-4 p-md-5">
                                <h2 class="h4 mb-3">4. Information Sharing and Disclosure</h2>
                                <p class="mb-3">We do not sell your personal information. We may share your information in the following circumstances:</p>
                                
                                <h5 class="mt-4 mb-3">With Other Users</h5>
                                <ul class="mb-4">
                                    <li>Your profile information (name, profile picture) is visible to other users</li>
                                    <li>Listing information you post is publicly visible</li>
                                    <li>Contact information may be shared when you initiate a transaction</li>
                                </ul>

                                <h5 class="mb-3">With Service Providers</h5>
                                <ul class="mb-4">
                                    <li>We may share information with third-party service providers who assist in operating our platform</li>
                                    <li>These providers are contractually obligated to protect your information</li>
                                </ul>

                                <h5 class="mb-3">Legal Requirements</h5>
                                <ul class="mb-0">
                                    <li>When required by law or legal process</li>
                                    <li>To protect our rights, property, or safety</li>
                                    <li>To protect the rights, property, or safety of our users</li>
                                    <li>In connection with a merger, acquisition, or sale of assets (with notice to users)</li>
                                </ul>
                            </div>
                        </div>

                        <!-- Data Security -->
                        <div class="card shadow-custom mb-4">
                            <div class="card-body p-4 p-md-5">
                                <h2 class="h4 mb-3">5. Data Security</h2>
                                <p class="mb-3">
                                    We implement appropriate technical and organizational measures to protect your personal information:
                                </p>
                                <ul class="mb-3">
                                    <li>Encryption of data in transit and at rest</li>
                                    <li>Secure authentication and access controls</li>
                                    <li>Regular security assessments and updates</li>
                                    <li>Limited access to personal information on a need-to-know basis</li>
                                </ul>
                                <p class="mb-0">
                                    However, no method of transmission over the internet or electronic storage is 100% secure. 
                                    While we strive to protect your information, we cannot guarantee absolute security.
                                </p>
                            </div>
                        </div>

                        <!-- Your Rights -->
                        <div class="card shadow-custom mb-4">
                            <div class="card-body p-4 p-md-5">
                                <h2 class="h4 mb-3">6. Your Rights and Choices</h2>
                                <p class="mb-3">You have the following rights regarding your personal information:</p>
                                <ul class="mb-0">
                                    <li><strong>Access:</strong> Request access to your personal information</li>
                                    <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                                    <li><strong>Deletion:</strong> Request deletion of your account and personal information</li>
                                    <li><strong>Data Portability:</strong> Request a copy of your data in a portable format</li>
                                    <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications (service emails may still be sent)</li>
                                    <li><strong>Cookie Preferences:</strong> Manage cookie settings through your browser</li>
                                </ul>
                            </div>
                        </div>

                        <!-- Cookies -->
                        <div class="card shadow-custom mb-4">
                            <div class="card-body p-4 p-md-5">
                                <h2 class="h4 mb-3">7. Cookies and Tracking Technologies</h2>
                                <p class="mb-3">
                                    We use cookies and similar technologies to enhance your experience:
                                </p>
                                <ul class="mb-3">
                                    <li><strong>Essential Cookies:</strong> Required for the platform to function</li>
                                    <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our platform</li>
                                    <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                                </ul>
                                <p class="mb-0">
                                    You can control cookies through your browser settings, but disabling certain cookies may 
                                    affect platform functionality.
                                </p>
                            </div>
                        </div>

                        <!-- Data Retention -->
                        <div class="card shadow-custom mb-4">
                            <div class="card-body p-4 p-md-5">
                                <h2 class="h4 mb-3">8. Data Retention</h2>
                                <p class="mb-0">
                                    We retain your personal information for as long as necessary to provide our services and 
                                    fulfill the purposes outlined in this policy. When you delete your account, we will delete 
                                    or anonymize your personal information, except where we are required to retain it for legal 
                                    or legitimate business purposes (such as transaction records for dispute resolution).
                                </p>
                            </div>
                        </div>

                        <!-- Children's Privacy -->
                        <div class="card shadow-custom mb-4">
                            <div class="card-body p-4 p-md-5">
                                <h2 class="h4 mb-3">9. Children's Privacy</h2>
                                <p class="mb-0">
                                    CampusCircle is intended for users who are at least 18 years old and are members of the 
                                    VinUni community. We do not knowingly collect personal information from children under 18. 
                                    If we become aware that we have collected information from a child under 18, we will take 
                                    steps to delete such information promptly.
                                </p>
                            </div>
                        </div>

                        <!-- Changes to Policy -->
                        <div class="card shadow-custom mb-4">
                            <div class="card-body p-4 p-md-5">
                                <h2 class="h4 mb-3">10. Changes to This Privacy Policy</h2>
                                <p class="mb-0">
                                    We may update this Privacy Policy from time to time. We will notify you of any material 
                                    changes by posting the new policy on this page and updating the "Last updated" date. 
                                    We encourage you to review this policy periodically to stay informed about how we protect 
                                    your information.
                                </p>
                            </div>
                        </div>

                        <!-- Contact -->
                        <div class="card shadow-custom">
                            <div class="card-body p-4 p-md-5">
                                <h2 class="h4 mb-3">11. Contact Us</h2>
                                <p class="mb-3">
                                    If you have questions, concerns, or requests regarding this Privacy Policy or our data 
                                    practices, please contact us:
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