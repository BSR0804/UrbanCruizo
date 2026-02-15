import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517724393608-256799052d96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80')" }}>
                <div className="absolute inset-0 bg-black/50 z-10" />
                <div className="relative z-20 text-center text-white px-4">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 font-serif">Luxury on Wheels</h1>
                    <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">Discover the ultimate freedom with our premium caravan rentals. Where comfort meets adventure.</p>
                    <Link to="/caravans" className="btn-primary text-lg px-8 py-3">
                        Explore Fleet
                    </Link>
                </div>
            </section>

            {/* Featured Section */}
            <section className="py-20 px-4 container mx-auto">
                <h2 className="text-4xl font-serif text-center mb-12 text-primary">Experience the Extraordinary</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-surface p-6 rounded-lg shadow-lg hover:shadow-primary/20 transition duration-300">
                        <h3 className="text-2xl font-serif mb-4 text-textPrimary">Premium Amenities</h3>
                        <p className="text-textSecondary">Fully equipped kitchens, luxury bedding, and modern entertainment systems in every unit.</p>
                    </div>
                    <div className="bg-surface p-6 rounded-lg shadow-lg hover:shadow-primary/20 transition duration-300">
                        <h3 className="text-2xl font-serif mb-4 text-textPrimary">Concierge Service</h3>
                        <p className="text-textSecondary">24/7 support and personalized itinerary planning to ensure a seamless journey.</p>
                    </div>
                    <div className="bg-surface p-6 rounded-lg shadow-lg hover:shadow-primary/20 transition duration-300">
                        <h3 className="text-2xl font-serif mb-4 text-textPrimary">Unlimited Mileage</h3>
                        <p className="text-textSecondary">explore without limits. Our transparent pricing means no hidden fees for distance.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
