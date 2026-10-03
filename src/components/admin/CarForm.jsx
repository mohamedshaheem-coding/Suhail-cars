import { useState, useEffect, useRef } from 'react';
import { X, Loader2, UploadCloud, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { addCar, updateCar, uploadCarImage } from '../../lib/api';

const MAX_IMAGES = 5;

const INITIAL_STATE = {
    make: '', model: '', year: '', price: '', km_driven: '',
    status: 'Available', description: '',
    colour: '', fuel_type: 'Petrol', transmission: 'Manual', body_type: '',
    ownership: '', insurance: '', location: '',
    features: '', image_urls: []
};

export default function CarForm({ car, isOpen, onClose, onSave }) {
    const [formData, setFormData] = useState(INITIAL_STATE);
    // Each entry: { file: File|null, preview: string, isExisting: bool }
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (car) {
            setFormData({ ...INITIAL_STATE, ...car, km_driven: car.km_driven || car.mileage || '' });
            // Support both old image_url (string) and new image_urls (array)
            const existingUrls = car.image_urls?.length
                ? car.image_urls
                : car.image_url
                    ? [car.image_url]
                    : [];
            setImages(existingUrls.map(url => ({ file: null, preview: url, isExisting: true })));
        } else {
            setFormData(INITIAL_STATE);
            setImages([]);
        }
        setError('');
    }, [car, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const remaining = MAX_IMAGES - images.length;
        if (remaining <= 0) return;
        const toAdd = files.slice(0, remaining).map(file => ({
            file,
            preview: URL.createObjectURL(file),
            isExisting: false
        }));
        setImages(prev => [...prev, ...toAdd]);
        // Reset input so same file can be re-selected
        e.target.value = '';
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const makeCover = (index) => {
        if (index === 0) return;
        setImages(prev => {
            const newImages = [...prev];
            const temp = newImages[0];
            newImages[0] = newImages[index];
            newImages[index] = temp;
            return newImages;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        let savedCar = null;
        try {
            const processedData = {
                ...formData,
                year: Number(formData.year),
                price: Number(formData.price),
                km_driven: Number(formData.km_driven),
            };
            delete processedData.mileage;

            // Upload any new files and collect all URLs
            const tempId = car?.id || Date.now().toString();
            const uploadedUrls = await Promise.all(
                images.map(async (img, idx) => {
                    if (img.isExisting) return img.preview; // already a Firebase URL
                    return await uploadCarImage(img.file, `${tempId}_${idx}`);
                })
            );

            if (uploadedUrls.length > 0) {
                processedData.image_urls = uploadedUrls;
                processedData.image_url = uploadedUrls[0];
            }

            if (car) {
                savedCar = await updateCar(car.id, processedData);
            } else {
                savedCar = await addCar(processedData);
            }
        } catch (err) {
            console.error('Error saving car:', err);
            setError('Failed to save: ' + (err.message || 'Unknown error'));
        } finally {
            setIsLoading(false);
        }

        // Only close AFTER finally has run (isLoading reset), to avoid stale loading state
        if (savedCar) {
            onSave(savedCar);
            onClose();
        }
    };

    const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm';
    const labelCls = 'block text-sm font-medium text-gray-700 mb-1';
    const canAddMore = images.length < MAX_IMAGES;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full relative my-8 mx-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">{car ? 'Edit Car' : 'Add New Car'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    {/* ── Multi-Image Upload ── */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className={labelCls}>
                                Car Photos
                                <span className="ml-1 text-gray-400 font-normal">({images.length}/{MAX_IMAGES})</span>
                            </label>
                            {canAddMore && (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                                >
                                    <UploadCloud className="h-3.5 w-3.5" /> Add Photos
                                </button>
                            )}
                        </div>

                        {/* Thumbnail Grid */}
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                            {images.map((img, idx) => (
                                <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                                    <img src={img.preview} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                                    {/* First image badge / Set cover */}
                                    {idx === 0 ? (
                                        <span className="absolute top-1 left-1 bg-primary-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded z-10">
                                            COVER
                                        </span>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => makeCover(idx)}
                                            className="absolute top-1 left-1 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-all hover:bg-primary-600 z-10 shadow-sm"
                                        >
                                            SET COVER
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}

                            {/* Add more slot */}
                            {canAddMore && (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-primary-400 flex flex-col items-center justify-center text-gray-400 hover:text-primary-500 transition-colors"
                                >
                                    <UploadCloud className="h-5 w-5 mb-1" />
                                    <span className="text-[10px] font-medium">Add</span>
                                </button>
                            )}
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <p className="text-xs text-gray-400 mt-2">
                            Upload up to {MAX_IMAGES} photos · JPG, PNG, WEBP · First photo is the cover image
                        </p>
                    </div>

                    {/* ── Core Details ── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>Make *</label>
                            <input type="text" name="make" required className={inputCls} placeholder="e.g. Toyota" value={formData.make} onChange={handleChange} />
                        </div>
                        <div>
                            <label className={labelCls}>Model *</label>
                            <input type="text" name="model" required className={inputCls} placeholder="e.g. Camry" value={formData.model} onChange={handleChange} />
                        </div>
                        <div>
                            <label className={labelCls}>Year *</label>
                            <input type="number" name="year" required className={inputCls} placeholder="2021" value={formData.year} onChange={handleChange} />
                        </div>
                        <div>
                            <label className={labelCls}>Price (₹) *</label>
                            <input type="number" name="price" required className={inputCls} placeholder="850000" value={formData.price} onChange={handleChange} />
                        </div>
                        <div>
                            <label className={labelCls}>KM Driven</label>
                            <input type="number" name="km_driven" className={inputCls} placeholder="45000" value={formData.km_driven} onChange={handleChange} />
                        </div>
                        <div>
                            <label className={labelCls}>Status</label>
                            <select name="status" className={inputCls} value={formData.status} onChange={handleChange}>
                                <option value="Available">Available</option>
                                <option value="Sold">Sold</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelCls}>Colour</label>
                            <input type="text" name="colour" className={inputCls} placeholder="e.g. Pearl White" value={formData.colour} onChange={handleChange} />
                        </div>
                        <div>
                            <label className={labelCls}>Body Type</label>
                            <input type="text" name="body_type" className={inputCls} placeholder="e.g. Sedan, SUV, Hatchback" value={formData.body_type} onChange={handleChange} />
                        </div>
                        <div>
                            <label className={labelCls}>Fuel Type</label>
                            <select name="fuel_type" className={inputCls} value={formData.fuel_type} onChange={handleChange}>
                                <option>Petrol</option>
                                <option>Diesel</option>
                                <option>Electric</option>
                                <option>Hybrid</option>
                                <option>CNG</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelCls}>Transmission</label>
                            <select name="transmission" className={inputCls} value={formData.transmission} onChange={handleChange}>
                                <option>Manual</option>
                                <option>Automatic</option>
                                <option>AMT</option>
                                <option>CVT</option>
                                <option>DCT</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelCls}>Ownership</label>
                            <select name="ownership" className={inputCls} value={formData.ownership} onChange={handleChange}>
                                <option value="">Select ownership</option>
                                <option>1st Owner</option>
                                <option>2nd Owner</option>
                                <option>3rd Owner</option>
                                <option>4th Owner</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelCls}>Insurance</label>
                            <input type="text" name="insurance" className={inputCls} placeholder="e.g. Valid till Dec 2025, Expired" value={formData.insurance} onChange={handleChange} />
                        </div>
                        <div>
                            <label className={labelCls}>Location</label>
                            <input type="text" name="location" className={inputCls} placeholder="e.g. Chennai, Tamil Nadu" value={formData.location} onChange={handleChange} />
                        </div>
                    </div>

                    <div>
                        <label className={labelCls}>Key Features <span className="text-gray-400 font-normal">(comma-separated)</span></label>
                        <input type="text" name="features" className={inputCls} placeholder="e.g. Sunroof, Apple CarPlay, Reverse Camera" value={formData.features} onChange={handleChange} />
                    </div>

                    <div>
                        <label className={labelCls}>Description *</label>
                        <textarea name="description" required rows="3" className={inputCls} placeholder="Brief description of the vehicle..." value={formData.description} onChange={handleChange} />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>Cancel</Button>
                        <Button type="submit" isLoading={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Car'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
