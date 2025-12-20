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
                    <div class="col-md-6">
                        <h5>♻️💰 CampusCircle</h5>
                        <p class="mb-0">
                            VinUni's student-exclusive marketplace for sustainable sharing
                        </p>
                    </div>
                    <div class="col-md-3">
                        <h6>Quick Links</h6>
                        <ul class="list-unstyled">
                            <li><a href="#" onclick="window.App.router.navigate('/')" class="text-light">Home</a></li>
                            <li><a href="#" onclick="window.App.router.navigate('/listings')" class="text-light">Browse Listings</a></li>
                            <li><a href="#" onclick="window.App.router.navigate('/about')" class="text-light">About</a></li>
                        </ul>
                    </div>
                    <div class="col-md-3">
                        <h6>Contact</h6>
                        <ul class="list-unstyled">
                            <li><small>support@vinuni.edu.vn</small></li>
                            <li><small>VinUniversity, Hanoi</small></li>
                        </ul>
                    </div>
                </div>
                <hr class="my-3" />
                <div class="text-center">
                    <small>
                        © 2025 CampusCircle. Made with ❤️ for VinUni students.
                    </small>
                </div>
            </div>
        `;
    }
}