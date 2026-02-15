import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { CityContext } from '../context/CityContext';

const HomePage = () => {
    const { setCity } = useContext(CityContext);
    const navigate = useNavigate();

    const cities = [
        { name: 'Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1600&auto=format&fit=crop' },
        { name: 'Mumbai', image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?q=80&w=1600&auto=format&fit=crop' },
        { name: 'Bangalore', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=1600&auto=format&fit=crop' },
        { name: 'Hyderabad', image: 'https://images.unsplash.com/photo-1574116992627-c1a17e08960e?q=80&w=1600&auto=format&fit=crop' },
        { name: 'Chennai', image: 'https://images.unsplash.com/photo-1616843413587-9e3a37f7bbd8?q=80&w=1600&auto=format&fit=crop' },
        { name: 'Pune', image: 'https://images.unsplash.com/photo-1600112356915-089abb8fc71a?q=80&w=1600&auto=format&fit=crop' },
        { name: 'Kolkata', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Howrah_Bridge_at_Night.jpg/1280px-Howrah_Bridge_at_Night.jpg' },
        { name: 'Jaipur', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1600&auto=format&fit=crop' },
    ];

    const handleCitySelect = (city) => {
        setCity(city);
        navigate('/vehicles');
    };

    return (
        <div className="min-h-screen bg-background">
            <section className="py-20 px-4 container mx-auto text-center">
                <h1 className="text-4xl md:text-6xl font-serif text-primary mb-8">Where do you want to drive?</h1>
                <p className="text-xl text-textSecondary mb-12">Select your city to see available rides</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {cities.map((city) => (
                        <div
                            key={city.name}
                            onClick={() => handleCitySelect(city.name)}
                            className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg border border-gray-800 hover:border-primary transition duration-300"
                        >
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition z-10" />
                            <img
                                src={city.image}
                                alt={city.name}
                                className="w-full h-40 object-cover group-hover:scale-110 transition duration-500"
                            />
                            <div className="absolute inset-x-0 bottom-0 p-4 z-20 bg-gradient-to-t from-black/90 to-transparent">
                                <h3 className="text-xl font-bold text-white text-center">{city.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;
