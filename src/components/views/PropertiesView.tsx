import React, { useState } from 'react';
import { useProperty } from '../../context/PropertyContext';
import { Property, Unit } from '../../types';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Users,
  Wrench,
  DollarSign,
  ChevronRight,
  X,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Home,
  Layers,
  Edit2,
  Archive,
} from 'lucide-react';
import { formatKES } from '../../utils/propertyMath';

export const PropertiesView: React.FC = () => {
  const {
    properties,
    units,
    tenants,
    maintenanceTickets,
    addProperty,
    addUnit,
    updateUnit,
    archiveProperty,
    currentUser,
    addToast,
  } = useProperty();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [viewMode, setViewMode] = useState<'CARDS' | 'TABLE'>('CARDS');

  // Add property modal state
  const [addPropOpen, setAddPropOpen] = useState(false);
  const [newPropName, setNewPropName] = useState('');
  const [newPropLocation, setNewPropLocation] = useState('');
  const [newPropCity, setNewPropCity] = useState('Nairobi');
  const [newPropType, setNewPropType] = useState<Property['type']>('APARTMENT');
  const [newPropCaretakerName, setNewPropCaretakerName] = useState('');
  const [newPropCaretakerPhone, setNewPropCaretakerPhone] = useState('');

  // Add unit modal state
  const [addUnitOpen, setAddUnitOpen] = useState(false);
  const [newUnitNumber, setNewUnitNumber] = useState('');
  const [newUnitType, setNewUnitType] = useState('2BR Master Ensuite');
  const [newUnitRent, setNewUnitRent] = useState(45000);
  const [newUnitServiceCharge, setNewUnitServiceCharge] = useState(3500);

  // Selected unit details state
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  // Filter properties
  const filteredProperties = properties.filter((p) => {
    if (p.archived) return false;
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPropName || !newPropLocation) {
      addToast('ERROR', 'Missing Fields', 'Property name and location are required.');
      return;
    }
    addProperty({
      name: newPropName,
      location: newPropLocation,
      city: newPropCity,
      type: newPropType,
      totalUnits: 0,
      caretakerName: newPropCaretakerName,
      caretakerPhone: newPropCaretakerPhone,
    });
    setAddPropOpen(false);
    setNewPropName('');
    setNewPropLocation('');
    setNewPropCaretakerName('');
    setNewPropCaretakerPhone('');
  };

  const handleCreateUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProperty || !newUnitNumber) return;
    addUnit({
      propertyId: selectedProperty.id,
      unitNumber: newUnitNumber,
      bedrooms: 2,
      typeLabel: newUnitType,
      monthlyRent: newUnitRent,
      serviceCharge: newUnitServiceCharge,
      status: 'VACANT',
    });
    setAddUnitOpen(false);
    setNewUnitNumber('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#24312D] dark:text-[#EDF5F1] tracking-tight">
            Properties & Units
          </h1>
          <p className="text-xs sm:text-sm text-[#64736C] dark:text-[#9EB2A9]">
            Manage building assets, unit inventories, and occupancy roll
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentUser.role !== 'READ_ONLY' && (
            <button
              onClick={() => setAddPropOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:hover:bg-[#93D6B7] text-white dark:text-[#111A17] rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Property</span>
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search properties by name or location..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white dark:bg-[#1B2622] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex items-center text-xs">
            <button
              onClick={() => setViewMode('CARDS')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                viewMode === 'CARDS'
                  ? 'bg-white dark:bg-[#1B2622] text-gray-900 dark:text-white shadow-xs font-semibold'
                  : 'text-gray-500'
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode('TABLE')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                viewMode === 'TABLE'
                  ? 'bg-white dark:bg-[#1B2622] text-gray-900 dark:text-white shadow-xs font-semibold'
                  : 'text-gray-500'
              }`}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Property Cards Grid */}
      {viewMode === 'CARDS' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProperties.map((prop) => {
            const propUnits = units.filter((u) => u.propertyId === prop.id);
            const occupied = propUnits.filter((u) => u.status === 'OCCUPIED').length;
            const vacant = propUnits.filter((u) => u.status === 'VACANT').length;
            const maintenance = propUnits.filter((u) => u.status === 'MAINTENANCE').length;
            const occRate = propUnits.length > 0 ? Math.round((occupied / propUnits.length) * 100) : 0;
            const totalMonthlyRoll = propUnits.reduce((acc, u) => acc + (u.monthlyRent + u.serviceCharge), 0);

            return (
              <div
                key={prop.id}
                onClick={() => setSelectedProperty(prop)}
                className="bg-white dark:bg-[#1B2622] rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] p-5 shadow-xs hover:border-[#2F8A68] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#2F8A68] dark:text-[#79C8A4]">
                        {prop.type}
                      </span>
                      <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 group-hover:text-[#2F8A68] transition-colors">
                        {prop.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span>{prop.location}, {prop.city}</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="inline-block text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                        {occRate}% Occupied
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 line-clamp-2 leading-relaxed">
                    {prop.description || 'Modern residential property with dedicated caretaker management.'}
                  </p>

                  {/* Units breakdown badges */}
                  <div className="mt-4 grid grid-cols-3 gap-2 bg-[#F6F8F6] dark:bg-[#24332D] p-2.5 rounded-xl text-center text-xs">
                    <div>
                      <div className="font-extrabold text-gray-900 dark:text-gray-100">{propUnits.length}</div>
                      <div className="text-[10px] text-gray-400">Total Units</div>
                    </div>
                    <div>
                      <div className="font-extrabold text-emerald-600 dark:text-emerald-400">{occupied}</div>
                      <div className="text-[10px] text-gray-400">Occupied</div>
                    </div>
                    <div>
                      <div className="font-extrabold text-amber-600 dark:text-amber-400">{vacant}</div>
                      <div className="text-[10px] text-gray-400">Vacant</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-gray-400 block">Expected Monthly Roll</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      {formatKES(totalMonthlyRoll)}
                    </span>
                  </div>
                  <div className="text-[#2F8A68] dark:text-[#79C8A4] font-semibold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                    <span>Manage Units</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white dark:bg-[#1B2622] rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs text-gray-700 dark:text-gray-300">
            <thead className="bg-[#F6F8F6] dark:bg-[#24332D] uppercase text-[10px] font-bold text-gray-500 dark:text-gray-400 border-b border-[#E2E8E5] dark:border-[#2D4039]">
              <tr>
                <th className="px-4 py-3">Property Name</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Units</th>
                <th className="px-4 py-3">Occupancy</th>
                <th className="px-4 py-3">Caretaker</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredProperties.map((p) => {
                const pUnits = units.filter((u) => u.propertyId === p.id);
                const occ = pUnits.filter((u) => u.status === 'OCCUPIED').length;
                const occPct = pUnits.length > 0 ? Math.round((occ / pUnits.length) * 100) : 0;
                return (
                  <tr
                    key={p.id}
                    onClick={() => setSelectedProperty(p)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">{p.name}</td>
                    <td className="px-4 py-3 text-gray-500">{p.location}</td>
                    <td className="px-4 py-3 font-medium">{pUnits.length} Units</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-emerald-600">{occPct}%</span> ({occ}/{pUnits.length})
                    </td>
                    <td className="px-4 py-3 text-gray-500">{p.caretakerName || 'None assigned'}</td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-xs font-semibold text-[#2F8A68] hover:underline">
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Property Details Drawer / Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white dark:bg-[#1B2622] h-full overflow-y-auto p-6 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right">
            <div>
              {/* Drawer Header */}
              <div className="flex items-start justify-between pb-4 border-b border-[#E2E8E5] dark:border-[#2D4039]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#2F8A68] dark:text-[#79C8A4]">
                    {selectedProperty.type}
                  </span>
                  <h2 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">
                    {selectedProperty.name}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{selectedProperty.location}, {selectedProperty.city}</span>
                  </p>
                </div>

                <button
                  onClick={() => setSelectedProperty(null)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Caretaker info banner */}
              {selectedProperty.caretakerName && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="text-gray-400 block text-[10px]">On-Site Caretaker</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {selectedProperty.caretakerName}
                    </span>
                  </div>
                  {selectedProperty.caretakerPhone && (
                    <a
                      href={`tel:${selectedProperty.caretakerPhone}`}
                      className="flex items-center gap-1 text-[#2F8A68] dark:text-[#79C8A4] font-medium"
                    >
                      <Phone className="w-3.5 h-3.5" /> {selectedProperty.caretakerPhone}
                    </a>
                  )}
                </div>
              )}

              {/* Units Section */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    Units Roster ({units.filter((u) => u.propertyId === selectedProperty.id).length})
                  </h3>
                  {currentUser.role !== 'READ_ONLY' && (
                    <button
                      onClick={() => setAddUnitOpen(true)}
                      className="flex items-center gap-1 text-xs font-semibold text-[#2F8A68] dark:text-[#79C8A4] hover:underline"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Unit
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {units
                    .filter((u) => u.propertyId === selectedProperty.id)
                    .map((unit) => {
                      const tenant = tenants.find((t) => t.id === unit.currentTenantId);
                      return (
                        <div
                          key={unit.id}
                          onClick={() => setSelectedUnit(unit)}
                          className="p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-[#2F8A68] dark:hover:border-[#79C8A4] flex items-center justify-between text-xs transition-all cursor-pointer bg-white dark:bg-[#202D28]"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-gray-800 dark:text-gray-200">
                              {unit.unitNumber}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 dark:text-gray-100">
                                {unit.typeLabel}
                              </div>
                              <div className="text-[11px] text-gray-400">
                                {tenant ? (
                                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                    Tenant: {tenant.name}
                                  </span>
                                ) : (
                                  <span className="text-amber-500 font-medium">Vacant</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="font-bold text-gray-900 dark:text-gray-100">
                              {formatKES(unit.monthlyRent + unit.serviceCharge)}
                            </div>
                            <span
                              className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                unit.status === 'OCCUPIED'
                                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                                  : unit.status === 'VACANT'
                                  ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                                  : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                              }`}
                            >
                              {unit.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
              {currentUser.role === 'LANDLORD' && (
                <button
                  onClick={() => {
                    archiveProperty(selectedProperty.id);
                    setSelectedProperty(null);
                  }}
                  className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
                >
                  <Archive className="w-3.5 h-3.5" /> Archive Property
                </button>
              )}
              <button
                onClick={() => setSelectedProperty(null)}
                className="ml-auto px-4 py-2 text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Property Modal */}
      {addPropOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#1B2622] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
              Add New Property
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Enter building details to expand your managed portfolio.
            </p>

            <form onSubmit={handleCreateProperty} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Property Name *
                </label>
                <input
                  type="text"
                  required
                  value={newPropName}
                  onChange={(e) => setNewPropName(e.target.value)}
                  placeholder="e.g. Parklands Executive Suites"
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Location / Street *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPropLocation}
                    onChange={(e) => setNewPropLocation(e.target.value)}
                    placeholder="e.g. 3rd Parklands Ave"
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    City / County
                  </label>
                  <input
                    type="text"
                    value={newPropCity}
                    onChange={(e) => setNewPropCity(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Caretaker Name
                  </label>
                  <input
                    type="text"
                    value={newPropCaretakerName}
                    onChange={(e) => setNewPropCaretakerName(e.target.value)}
                    placeholder="e.g. Samuel Mutua"
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Caretaker Phone
                  </label>
                  <input
                    type="text"
                    value={newPropCaretakerPhone}
                    onChange={(e) => setNewPropCaretakerPhone(e.target.value)}
                    placeholder="+254 7..."
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setAddPropOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:text-[#111A17] rounded-xl"
                >
                  Save Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Unit Modal */}
      {addUnitOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#1B2622] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
              Add Unit to {selectedProperty?.name}
            </h3>

            <form onSubmit={handleCreateUnit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Unit Number / Door *
                </label>
                <input
                  type="text"
                  required
                  value={newUnitNumber}
                  onChange={(e) => setNewUnitNumber(e.target.value)}
                  placeholder="e.g. C3, Villa 4, Flat 10"
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Unit Type
                </label>
                <input
                  type="text"
                  value={newUnitType}
                  onChange={(e) => setNewUnitType(e.target.value)}
                  placeholder="e.g. 2BR Master Ensuite"
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Monthly Rent (KES)
                  </label>
                  <input
                    type="number"
                    value={newUnitRent}
                    onChange={(e) => setNewUnitRent(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Service Charge (KES)
                  </label>
                  <input
                    type="number"
                    value={newUnitServiceCharge}
                    onChange={(e) => setNewUnitServiceCharge(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setAddUnitOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:text-[#111A17] rounded-xl"
                >
                  Create Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
