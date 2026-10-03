import { useState, useEffect } from 'react';
import { getCars, deleteCar } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Plus, Edit, Trash2, Loader2, AlertTriangle, X } from 'lucide-react';
import CarForm from '../../components/admin/CarForm';

// Custom confirm modal – no more browser window.confirm
function ConfirmModal({ isOpen, onConfirm, onCancel, carName }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-100 rounded-full">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">Delete Car</h2>
                </div>
                <p className="text-gray-600 mb-6">
                    Are you sure you want to delete <span className="font-semibold text-gray-900">{carName}</span>? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                    <Button variant="secondary" onClick={onCancel}>Cancel</Button>
                    <Button variant="danger" onClick={onConfirm}>Yes, Delete</Button>
                </div>
            </div>
        </div>
    );
}

export default function Inventory() {
    const [cars, setCars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCar, setEditingCar] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null); // car to delete
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => { fetchCars(); }, []);

    const fetchCars = async () => {
        try {
            const data = await getCars();
            setCars(data);
        } catch (error) {
            console.error("Failed to fetch inventory:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        try {
            await deleteCar(deleteTarget.id);
            setCars(cars.filter(c => c.id !== deleteTarget.id));
        } catch (error) {
            console.error(error);
        } finally {
            setIsDeleting(false);
            setDeleteTarget(null);
        }
    };

    const handleEdit = (car) => { setEditingCar(car); setIsFormOpen(true); };
    const handleAdd = () => { setEditingCar(null); setIsFormOpen(true); };
    const handleSave = (savedCar) => {
        if (editingCar) {
            setCars(cars.map(c => c.id === savedCar.id ? savedCar : c));
        } else {
            setCars([savedCar, ...cars]);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
                    <p className="text-gray-500 text-sm mt-1">{cars.length} car{cars.length !== 1 ? 's' : ''} in database</p>
                </div>
                <Button onClick={handleAdd}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Car
                </Button>
            </div>

            <div className="grid gap-4">
                {cars.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                        <p className="text-gray-400">No cars in inventory. Add one to get started!</p>
                    </div>
                ) : (
                    cars.map((car) => (
                        <Card key={car.id} className="overflow-hidden hover:shadow-md transition-shadow">
                            <CardContent className="p-0 flex flex-col sm:flex-row">
                                <div className="sm:w-44 h-32 sm:h-auto bg-gray-100 shrink-0">
                                    <img
                                        src={car.image_url}
                                        alt={`${car.make} ${car.model}`}
                                        className="w-full h-full object-cover"
                                        onError={e => { e.target.src = 'https://placehold.co/400x300?text=No+Image'; }}
                                    />
                                </div>
                                <div className="p-4 flex-grow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <h3 className="text-base font-bold text-gray-900">{car.make} {car.model}</h3>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            {car.year} · {car.mileage?.toLocaleString('en-IN')} km
                                            {car.fuel_type ? ` · ${car.fuel_type}` : ''}
                                            {car.transmission ? ` · ${car.transmission}` : ''}
                                        </p>
                                        <p className="font-bold text-primary-600 mt-1 text-sm">₹{car.price?.toLocaleString('en-IN')}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${car.status === 'Available'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                            }`}>
                                            {car.status}
                                        </span>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => handleEdit(car)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="danger" size="sm" onClick={() => setDeleteTarget(car)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            <CarForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                car={editingCar}
                onSave={handleSave}
            />

            <ConfirmModal
                isOpen={!!deleteTarget}
                carName={deleteTarget ? `${deleteTarget.make} ${deleteTarget.model}` : ''}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
}
