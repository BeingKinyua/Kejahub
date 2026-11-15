import React, { useState, useEffect } from 'react';
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
import { GSAPEntrance } from '../animation/GSAPEntrance';

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

  // Close active modal or drawer on Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (addUnitOpen) {
        setAddUnitOpen(false);
      } else if (addPropOpen) {
        setAddPropOpen(false);
      } else if (selectedProperty) {
        setSelectedProperty(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [addUnitOpen, addPropOpen, selectedProperty]);

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
    <GSAPEntrance className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#24312D] dark:text-[#EDF5F1] tracking-tight text-balance">
            Properties &amp; Units
          </h1>
          <p className="text-xs sm:text-sm text-[#64736C] dark:text-[#9EB2A9]">
            Manage building assets, unit inventories, and occupancy roll
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {currentUser.role !== 'READ_ONLY' && (
            <button
              type="button"
              onClick={() => setAddPropOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:hover:bg-[#93D6B7] text-white dark:text-[#111A17] rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Add Property</span>
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#64736C] dark:text-[#9EB2A9] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
          <input
            type="search"
            aria-label="Search properties by name or location"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search properties by name or location..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white dark:bg-[#1B2622] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1] placeholder-[#64736C] dark:placeholder-[#9EB2A9] focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="bg-[#F0F4F2] dark:bg-[#24332D] p-1 rounded-xl flex items-center text-xs" role="group" aria-label="View mode">
            <button
              type="button"
              aria-pressed={viewMode === 'CARDS'}
              onClick={() => setViewMode('CARDS')}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                viewMode === 'CARDS'
                  ? 'bg-white dark:bg-[#1B2622] text-[#24312D] dark:text-[#EDF5F1] shadow-xs font-semibold'
                  : 'text-[#64736C] dark:text-[#9EB2A9]'
              }`}
            >
              Cards
            </button>
            <button
              type="button"
              aria-pressed={viewMode === 'TABLE'}
              onClick={() => setViewMode('TABLE')}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                viewMode === 'TABLE'
                  ? 'bg-white dark:bg-[#1B2622] text-[#24312D] dark:text-[#EDF5F1] shadow-xs font-semibold'
                  : 'text-[#64736C] dark:text-[#9EB2A9]'
              }`}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Empty Search State */}
      {filteredProperties.length === 0 ? (
        <div className="bg-white dark:bg-[#1B2622] rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] p-10 text-center">
          <Building2 className="w-8 h-8 mx-auto text-[#64736C] dark:text-[#9EB2A9] mb-2" aria-hidden="true" />
          <h2 className="text-sm font-bold text-[#24312D] dark:text-[#EDF5F1]">
            No matching properties found
          </h2>
          <p className="text-xs text-[#64736C] dark:text-[#9EB2A9] mt-1">
            Try another estate name or road location, or clear your search filter.
          </p>
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-[#F0F4F2] dark:bg-[#24332D] text-[#24312D] dark:text-[#EDF5F1] hover:bg-[#E2E8E5] dark:hover:bg-[#2D4039] cursor-pointer"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : viewMode === 'CARDS' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProperties.map((prop) => {
            const propUnits = units.filter((u) => u.propertyId === prop.id);
            const occupied = propUnits.filter((u) => u.status === 'OCCUPIED').length;
            const vacant = propUnits.filter((u) => u.status === 'VACANT').length;
            const occRate = propUnits.length > 0 ? Math.round((occupied / propUnits.length) * 100) : 0;
            const totalMonthlyRoll = propUnits.reduce((acc, u) => acc + (u.monthlyRent + u.serviceCharge), 0);

            return (
              <button
                key={prop.id}
                type="button"
                onClick={() => setSelectedProperty(prop)}
                className="w-full text-left bg-white dark:bg-[#1B2622] rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] p-5 shadow-xs hover:border-[#2F8A68] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F8A68]"
              >
                <div className="w-full">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#267256] dark:text-[#79C8A4]">
                        {prop.type}
                      </span>
                      <h3 className="text-base font-bold text-[#24312D] dark:text-[#EDF5F1] group-hover:text-[#267256] dark:group-hover:text-[#79C8A4] transition-colors">
                        {prop.name}
                      </h3>
                      <p className="text-xs text-[#64736C] dark:text-[#9EB2A9] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span className="truncate">{prop.location}, {prop.city}</span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-block text-xs font-bold tabular-nums bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full whitespace-nowrap">
                        {occRate}% Occupied
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#64736C] dark:text-[#9EB2A9] mt-3 line-clamp-2 leading-relaxed">
                    {prop.description || 'Modern residential property with dedicated caretaker management.'}
                  </p>

                  {/* Units breakdown badges */}
                  <div className="mt-4 grid grid-cols-3 gap-2 bg-[#F6F8F6] dark:bg-[#24332D] p-2.5 rounded-xl text-center text-xs">
                    <div>
                      <div className="font-extrabold tabular-nums text-[#24312D] dark:text-[#EDF5F1]">{propUnits.length}</div>
                      <div className="text-[11px] text-[#64736C] dark:text-[#9EB2A9]">Total Units</div>
                    </div>
                    <div>
                      <div className="font-extrabold tabular-nums text-emerald-700 dark:text-emerald-400">{occupied}</div>
                      <div className="text-[11px] text-[#64736C] dark:text-[#9EB2A9]">Occupied</div>
                    </div>
                    <div>
                      <div className="font-extrabold tabular-nums text-amber-700 dark:text-amber-400">{vacant}</div>
                      <div className="text-[11px] text-[#64736C] dark:text-[#9EB2A9]">Vacant</div>
                    </div>
                  </div>
                </div>

                <div className="w-full mt-4 pt-3 border-t border-[#E2E8E5] dark:border-[#2D4039] flex items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="text-[11px] text-[#64736C] dark:text-[#9EB2A9] block">Expected Monthly Roll</span>
                    <span className="font-bold tabular-nums text-[#24312D] dark:text-[#EDF5F1]">
                      {formatKES(totalMonthlyRoll)}
                    </span>
                  </div>
                  <div className="text-[#267256] dark:text-[#79C8A4] font-semibold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform shrink-0">
                    <span>Manage Units</span>
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white dark:bg-[#1B2622] rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#24312D] dark:text-[#EDF5F1]">
              <thead className="bg-[#F6F8F6] dark:bg-[#24332D] uppercase text-[10px] font-bold text-[#64736C] dark:text-[#9EB2A9] border-b border-[#E2E8E5] dark:border-[#2D4039]">
                <tr>
                  <th className="px-4 py-3">Property Name</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Units</th>
                  <th className="px-4 py-3">Occupancy</th>
                  <th className="px-4 py-3">Caretaker</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8E5] dark:divide-[#2D4039]">
                {filteredProperties.map((p) => {
                  const pUnits = units.filter((u) => u.propertyId === p.id);
                  const occ = pUnits.filter((u) => u.status === 'OCCUPIED').length;
                  const occPct = pUnits.length > 0 ? Math.round((occ / pUnits.length) * 100) : 0;
                  return (
                    <tr
                      key={p.id}
                      tabIndex={0}
                      onClick={() => setSelectedProperty(p)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedProperty(p);
                        }
                      }}
                      className="hover:bg-[#F6F8F6] dark:hover:bg-[#202D28]/60 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2F8A68]"
                    >
                      <td className="px-4 py-3 font-semibold text-[#24312D] dark:text-[#EDF5F1]">{p.name}</td>
                      <td className="px-4 py-3 text-[#64736C] dark:text-[#9EB2A9]">{p.location}</td>
                      <td className="px-4 py-3 font-medium tabular-nums">{pUnits.length} Units</td>
                      <td className="px-4 py-3 tabular-nums">
                        <span className="font-semibold text-[#267256] dark:text-[#79C8A4]">{occPct}%</span> ({occ}/{pUnits.length})
                      </td>
                      <td className="px-4 py-3 text-[#64736C] dark:text-[#9EB2A9]">{p.caretakerName || 'None assigned'}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProperty(p);
                          }}
                          className="text-xs font-semibold text-[#267256] dark:text-[#79C8A4] hover:underline cursor-pointer"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Property Details Drawer / Modal */}
      {selectedProperty && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex justify-end backdrop-blur-xs"
          onClick={() => setSelectedProperty(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="property-drawer-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-white dark:bg-[#1B2622] h-full overflow-y-auto p-6 shadow-2xl flex flex-col justify-between"
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#E2E8E5] dark:border-[#2D4039]">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#267256] dark:text-[#79C8A4]">
                    {selectedProperty.type}
                  </span>
                  <h2 id="property-drawer-title" className="text-xl font-extrabold text-[#24312D] dark:text-[#EDF5F1]">
                    {selectedProperty.name}
                  </h2>
                  <p className="text-xs text-[#64736C] dark:text-[#9EB2A9] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{selectedProperty.location}, {selectedProperty.city}</span>
                  </p>
                </div>

                <button
                  type="button"
                  aria-label="Close property details"
                  onClick={() => setSelectedProperty(null)}
                  className="p-2 rounded-lg text-[#64736C] dark:text-[#9EB2A9] hover:text-[#24312D] dark:hover:text-[#EDF5F1] hover:bg-[#F0F4F2] dark:hover:bg-[#24332D] cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              {/* Caretaker info banner */}
              {selectedProperty.caretakerName && (
                <div className="mt-4 p-3 bg-[#F6F8F6] dark:bg-[#24332D] rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="text-[#64736C] dark:text-[#9EB2A9] block text-[11px]">On-Site Caretaker</span>
                    <span className="font-semibold text-[#24312D] dark:text-[#EDF5F1]">
                      {selectedProperty.caretakerName}
                    </span>
                  </div>
                  {selectedProperty.caretakerPhone && (
                    <a
                      href={`tel:${selectedProperty.caretakerPhone}`}
                      className="flex items-center gap-1 text-[#267256] dark:text-[#79C8A4] font-medium tabular-nums"
                    >
                      <Phone className="w-3.5 h-3.5" aria-hidden="true" /> {selectedProperty.caretakerPhone}
                    </a>
                  )}
                </div>
              )}

              {/* Units Section */}
              <div className="mt-6">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h3 className="text-sm font-bold text-[#24312D] dark:text-[#EDF5F1] tabular-nums">
                    Units Roster ({units.filter((u) => u.propertyId === selectedProperty.id).length})
                  </h3>
                  {currentUser.role !== 'READ_ONLY' && (
                    <button
                      type="button"
                      onClick={() => setAddUnitOpen(true)}
                      className="flex items-center gap-1 text-xs font-semibold text-[#267256] dark:text-[#79C8A4] hover:underline cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" aria-hidden="true" /> Add Unit
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {units
                    .filter((u) => u.propertyId === selectedProperty.id)
                    .map((unit) => {
                      const tenant = tenants.find((t) => t.id === unit.currentTenantId);
                      return (
                        <button
                          key={unit.id}
                          type="button"
                          onClick={() => setSelectedUnit(unit)}
                          className="w-full text-left p-3 rounded-xl border border-[#E2E8E5] dark:border-[#2D4039] hover:border-[#2F8A68] dark:hover:border-[#79C8A4] flex items-center justify-between gap-3 text-xs transition-all cursor-pointer bg-white dark:bg-[#202D28]"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-[#F0F4F2] dark:bg-[#24332D] flex items-center justify-center font-bold tabular-nums text-[#24312D] dark:text-[#EDF5F1] shrink-0">
                              {unit.unitNumber}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-[#24312D] dark:text-[#EDF5F1]">
                                {unit.typeLabel}
                              </div>
                              <div className="text-[11px] text-[#64736C] dark:text-[#9EB2A9] truncate">
                                {tenant ? (
                                  <span className="text-[#267256] dark:text-[#79C8A4] font-medium">
                                    Tenant: {tenant.name}
                                  </span>
                                ) : (
                                  <span className="text-amber-700 dark:text-amber-400 font-medium">Vacant</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="font-bold tabular-nums text-[#24312D] dark:text-[#EDF5F1]">
                              {formatKES(unit.monthlyRent + unit.serviceCharge)}
                            </div>
                            <span
                              className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
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
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 mt-6 border-t border-[#E2E8E5] dark:border-[#2D4039] flex items-center justify-between gap-2">
              {currentUser.role === 'LANDLORD' && (
                <button
                  type="button"
                  onClick={() => {
                    archiveProperty(selectedProperty.id);
                    setSelectedProperty(null);
                  }}
                  className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Archive className="w-3.5 h-3.5" aria-hidden="true" /> Archive Property
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedProperty(null)}
                className="ml-auto px-4 py-2 text-xs font-semibold bg-[#F0F4F2] dark:bg-[#24332D] text-[#24312D] dark:text-[#EDF5F1] rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Property Modal */}
      {addPropOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setAddPropOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-prop-title"
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#1B2622] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E2E8E5] dark:border-[#2D4039]"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 id="add-prop-title" className="text-lg font-bold text-[#24312D] dark:text-[#EDF5F1]">
                Add New Property
              </h3>
              <button
                type="button"
                aria-label="Close modal"
                onClick={() => setAddPropOpen(false)}
                className="p-1.5 rounded-lg text-[#64736C] dark:text-[#9EB2A9] hover:text-[#24312D] dark:hover:text-[#EDF5F1] hover:bg-[#F0F4F2] dark:hover:bg-[#24332D] cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
            <p className="text-xs text-[#64736C] dark:text-[#9EB2A9] mb-4">
              Enter building details to expand your managed portfolio.
            </p>

            <form onSubmit={handleCreateProperty} className="space-y-4">
              <div>
                <label htmlFor="prop-name" className="block text-xs font-semibold text-[#24312D] dark:text-[#EDF5F1] mb-1">
                  Property Name *
                </label>
                <input
                  id="prop-name"
                  type="text"
                  required
                  value={newPropName}
                  onChange={(e) => setNewPropName(e.target.value)}
                  placeholder="e.g. Parklands Executive Suites"
                  className="w-full px-3 py-2 text-sm bg-[#F6F8F6] dark:bg-[#24332D] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="prop-location" className="block text-xs font-semibold text-[#24312D] dark:text-[#EDF5F1] mb-1">
                    Location / Street *
                  </label>
                  <input
                    id="prop-location"
                    type="text"
                    required
                    value={newPropLocation}
                    onChange={(e) => setNewPropLocation(e.target.value)}
                    placeholder="e.g. 3rd Parklands Ave"
                    className="w-full px-3 py-2 text-sm bg-[#F6F8F6] dark:bg-[#24332D] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1]"
                  />
                </div>

                <div>
                  <label htmlFor="prop-city" className="block text-xs font-semibold text-[#24312D] dark:text-[#EDF5F1] mb-1">
                    City / County
                  </label>
                  <input
                    id="prop-city"
                    type="text"
                    value={newPropCity}
                    onChange={(e) => setNewPropCity(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-[#F6F8F6] dark:bg-[#24332D] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="prop-caretaker-name" className="block text-xs font-semibold text-[#24312D] dark:text-[#EDF5F1] mb-1">
                    Caretaker Name
                  </label>
                  <input
                    id="prop-caretaker-name"
                    type="text"
                    value={newPropCaretakerName}
                    onChange={(e) => setNewPropCaretakerName(e.target.value)}
                    placeholder="e.g. Samuel Mutua"
                    className="w-full px-3 py-2 text-sm bg-[#F6F8F6] dark:bg-[#24332D] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1]"
                  />
                </div>

                <div>
                  <label htmlFor="prop-caretaker-phone" className="block text-xs font-semibold text-[#24312D] dark:text-[#EDF5F1] mb-1">
                    Caretaker Phone
                  </label>
                  <input
                    id="prop-caretaker-phone"
                    type="tel"
                    value={newPropCaretakerPhone}
                    onChange={(e) => setNewPropCaretakerPhone(e.target.value)}
                    placeholder="+254 7..."
                    className="w-full px-3 py-2 text-sm bg-[#F6F8F6] dark:bg-[#24332D] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1]"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-[#E2E8E5] dark:border-[#2D4039]">
                <button
                  type="button"
                  onClick={() => setAddPropOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#64736C] dark:text-[#9EB2A9] hover:bg-[#F0F4F2] dark:hover:bg-[#24332D] rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:text-[#111A17] rounded-xl cursor-pointer"
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
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setAddUnitOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-unit-title"
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#1B2622] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E2E8E5] dark:border-[#2D4039]"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 id="add-unit-title" className="text-lg font-bold text-[#24312D] dark:text-[#EDF5F1]">
                Add Unit to {selectedProperty?.name}
              </h3>
              <button
                type="button"
                aria-label="Close modal"
                onClick={() => setAddUnitOpen(false)}
                className="p-1.5 rounded-lg text-[#64736C] dark:text-[#9EB2A9] hover:text-[#24312D] dark:hover:text-[#EDF5F1] hover:bg-[#F0F4F2] dark:hover:bg-[#24332D] cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleCreateUnit} className="space-y-4 mt-4">
              <div>
                <label htmlFor="unit-number" className="block text-xs font-semibold text-[#24312D] dark:text-[#EDF5F1] mb-1">
                  Unit Number / Door *
                </label>
                <input
                  id="unit-number"
                  type="text"
                  required
                  value={newUnitNumber}
                  onChange={(e) => setNewUnitNumber(e.target.value)}
                  placeholder="e.g. C3, Villa 4, Flat 10"
                  className="w-full px-3 py-2 text-sm bg-[#F6F8F6] dark:bg-[#24332D] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1]"
                />
              </div>

              <div>
                <label htmlFor="unit-type" className="block text-xs font-semibold text-[#24312D] dark:text-[#EDF5F1] mb-1">
                  Unit Type
                </label>
                <input
                  id="unit-type"
                  type="text"
                  value={newUnitType}
                  onChange={(e) => setNewUnitType(e.target.value)}
                  placeholder="e.g. 2BR Master Ensuite"
                  className="w-full px-3 py-2 text-sm bg-[#F6F8F6] dark:bg-[#24332D] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="unit-rent" className="block text-xs font-semibold text-[#24312D] dark:text-[#EDF5F1] mb-1">
                    Monthly Rent (KES)
                  </label>
                  <input
                    id="unit-rent"
                    type="number"
                    value={newUnitRent}
                    onChange={(e) => setNewUnitRent(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm tabular-nums bg-[#F6F8F6] dark:bg-[#24332D] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1]"
                  />
                </div>

                <div>
                  <label htmlFor="unit-sc" className="block text-xs font-semibold text-[#24312D] dark:text-[#EDF5F1] mb-1">
                    Service Charge (KES)
                  </label>
                  <input
                    id="unit-sc"
                    type="number"
                    value={newUnitServiceCharge}
                    onChange={(e) => setNewUnitServiceCharge(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm tabular-nums bg-[#F6F8F6] dark:bg-[#24332D] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1]"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-[#E2E8E5] dark:border-[#2D4039]">
                <button
                  type="button"
                  onClick={() => setAddUnitOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#64736C] dark:text-[#9EB2A9] hover:bg-[#F0F4F2] dark:hover:bg-[#24332D] rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:text-[#111A17] rounded-xl cursor-pointer"
                >
                  Create Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </GSAPEntrance>
  );
};
