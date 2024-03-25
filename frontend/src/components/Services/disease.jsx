import React, { useState, useEffect } from 'react';

const Disease = () => {
    const [images, setImages] = useState([]);
    const [wallpapers, setWallpapers] = useState([]);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        const response = await fetch(
            'https://www.googleapis.com/customsearch/v1?key=AIzaSyBK7o_ljSgxmd5kaYjuMiUX420SvncEoNc&cx=f3a6b1b25078b42d3&q=crop+disease+detection+&searchType=image'
        );
        const data = await response.json();
        console.log(data)
        setImages(data.items);
    };

    const setWallpaper = (src) => {
        // Set the wallpaper using the src of the clicked image
        // console.log('Setting wallpaper:', src);
        setWallpapers(src);
        // console.log('Setting wallpaper:', setWallpapers);
        document.body.style.backgroundImage = `url(${src})`;
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-green-800 bg-cover bg-center" style={{ backgroundImage: `url(${wallpapers})` }}>
            <div className="text-center">
                <h1 className="text-7xl font-extrabold  text-white mb-4">
                    Disease Detection
                </h1>
                <p className="text-white text-2xl ">
                    Our Disease Detection page is currently under construction.
                    <br />
                    Stay tuned for exciting updates!
                </p>
            </div>
            <aside className="fixed bootom-0 left-0 right-0 m-4 border max-w-80 h-full">
                <div className="overflow-y-auto max-w-80">
                    <h1 className="text-white bg-black text-xl ">Disease Detection related images </h1>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {images.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => setWallpaper(image.link)}
                            >
                                <img
                                    src={image.link}
                                    alt={image.title}
                                    className="max-w-full mx-auto"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default Disease;