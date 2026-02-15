const Footer = () => {
    return (
        <footer className="bg-surface py-8 mt-12 border-t border-secondary/20">
            <div className="container mx-auto px-4 text-center">
                <p className="text-textSecondary mb-4">
                    Experience luxury on wheels. Book your dream caravan today.
                </p>
                <p className="text-sm text-gray-600">
                    &copy; {new Date().getFullYear()} CarawINN. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
