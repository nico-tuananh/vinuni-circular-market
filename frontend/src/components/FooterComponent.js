// Footer Component
export class FooterComponent {
    constructor(containerId) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
    }

    render() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="container">
                <div class="row">
                    <div class="col-md-5">
                        <h5>CampusCircle</h5>
                        <p class="mb-0">
                            A sustainable marketplace by VinUnians, for VinUnians
                        </p>
                    </div>
                    <div class="col-md-3">
                        <h6>About Us</h6>
                        <ul class="list-unstyled">
                            <li><a href="#" onclick="window.App.router.navigate('/about')" class="text-light">About</a></li>
                            <li><a href="#" onclick="window.App.router.navigate('/terms-of-service')" class="text-light">Terms of Service</a></li>
                            <li><a href="#" onclick="window.App.router.navigate('/privacy-policy')" class="text-light">Privacy Policy</a></li>
                        </ul>
                    </div>
                    <div class="col-md-4">
                        <h6>Contact</h6>
                        <ul class="list-unstyled">
                            <li><small><a href="mailto:campuscircle@vinuni.edu.vn" class="text-light">campuscircle@vinuni.edu.vn</a></small></li>
                            <li><small>VinUniversity, Vinhomes Ocean Park, Gia Lam Ward, Hanoi, Vietnam</small></li>
                        </ul>
                    </div>
                </div>
                <hr class="my-3" />
                <div class="text-center">
                    <small>
                        © 2025 <a href="#" onclick="window.App.router.navigate('/')" class="text-light">CampusCircle</a>. Made with ❤️ for VinUni students.
                    </small>
                </div>
            </div>
        `;
    }
}