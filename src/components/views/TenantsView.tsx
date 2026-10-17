import React, { useState } from 'react';
import { useProperty } from '../../context/PropertyContext';
import { Tenant } from '../../types';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Calendar,
  Building,
  AlertCircle,
  CheckCircle2,
  Clock,
  Send,
  MessageSquare,
  X,
  FileText,
  DollarSign,
  Sparkles,
} from 'lucide-react';
import { formatKES } from '../../utils/propertyMath';

export const TenantsView: React.FC = () => {
  const {
    tenants,
    units,
    properties,
    transactions,
    maintenanceTickets,
    whatsappMessages,
    getTenantBalance,
    sendWhatsAppMessage,
    addTenant,
    currentUser,
    addToast,
    setIsAssistantOpen,
  } = useProperty();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'EXPIRING_SOON' | 'OVERDUE'>('ALL');
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  // Add Tenant Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+254 ');
  const [email, setEmail] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [propertyId, setPropertyId] = useState(properties[0]?.id || '');
  const [unitId, setUnitId] = useState('');
  const [deposit, setDeposit] = useState(45000);
  const [leaseStart, setLeaseStart] = useState('2026-10-01');
  const [leaseEnd, setLeaseEnd] = useState('2027-09-30');

  // WhatsApp composer state in drawer
  const [waText, setWaText] = useState('');

  // Filtered tenants
  const filteredTenants = tenants.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.phone.includes(searchTerm) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'EXPIRING_SOON') return t.leaseStatus === 'EXPIRING_SOON';
    if (statusFilter === 'OVERDUE') {
      const b = getTenantBalance(t.id);
      return b.status === 'OVERDUE' || b.status === 'PARTIAL';
    }
    return t.leaseStatus === 'ACTIVE';
  });

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !unitId) {
      addToast('ERROR', 'Missing Fields', 'Name, phone, and assigned unit are required.');
      return;
    }

    addTenant(
      {
        name,
        phone,
        email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
        nationalIdOrPassport: nationalId || '30000000',
        assignedPropertyId: propertyId,
        assignedUnitId: unitId,
        leaseStart,
        leaseEnd,
        leaseStatus: 'ACTIVE',
        depositAmount: deposit,
      },
      unitId
    );

    setAddModalOpen(false);
    setName('');
    setPhone('+254 ');
    setEmail('');
    setUnitId('');
  };

  const handleSendWhatsApp = () => {
    if (!selectedTenant || !waText.trim()) return;
    sendWhatsAppMessage(selectedTenant.id, waText.trim());
    setWaText('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#24312D] dark:text-[#EDF5F1] tracking-tight">
            Tenants & Leases
          </h1>
          <p className="text-xs sm:text-sm text-[#64736C] dark:text-[#9EB2A9]">
            Tenant registry, active agreements, balances, and WhatsApp communications
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentUser.role !== 'READ_ONLY' && (
            <button
              onClick={() => setAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:hover:bg-[#93D6B7] text-white dark:text-[#111A17] rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Register Tenant</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by tenant name, phone (+254...), email..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white dark:bg-[#1B2622] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
          />
        </div>

        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl text-xs self-start sm:self-auto overflow-x-auto">
          {(['ALL', 'ACTIVE', 'OVERDUE', 'EXPIRING_SOON'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                statusFilter === filter
                  ? 'bg-white dark:bg-[#1B2622] text-gray-900 dark:text-white shadow-xs font-semibold'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {filter === 'ALL'
                ? 'All Tenants'
                : filter === 'ACTIVE'
                ? 'Active'
                : filter === 'OVERDUE'
                ? 'Arrears'
                : 'Expiring Soon'}
            </button>
          ))}
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-white dark:bg-[#1B2622] rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700 dark:text-gray-300">
            <thead className="bg-[#F6F8F6] dark:bg-[#24332D] uppercase text-[10px] font-bold text-gray-500 dark:text-gray-400 border-b border-[#E2E8E5] dark:border-[#2D4039]">
              <tr>
                <th className="px-4 py-3">Tenant Details</th>
                <th className="px-4 py-3">Assigned Unit</th>
                <th className="px-4 py-3">Lease Period</th>
                <th className="px-4 py-3">October Balance</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredTenants.map((tenant) => {
                const unit = units.find((u) => u.id === tenant.assignedUnitId);
                const property = properties.find((p) => p.id === tenant.assignedPropertyId);
                const balanceInfo = getTenantBalance(tenant.id);

                return (
                  <tr
                    key={tenant.id}
                    onClick={() => setSelectedTenant(tenant)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#173C32]/10 dark:bg-[#79C8A4]/20 text-[#173C32] dark:text-[#79C8A4] font-bold flex items-center justify-center shrink-0">
                          {tenant.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-gray-100">{tenant.name}</div>
                          <div className="text-[11px] text-gray-400 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-emerald-600" /> {tenant.phone}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        Unit {unit?.unitNumber || 'Unassigned'}
                      </div>
                      <div className="text-[11px] text-gray-400 truncate max-w-[160px]">
                        {property?.name}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-medium text-gray-800 dark:text-gray-200">
                        {tenant.leaseEnd ? new Date(tenant.leaseEnd).toLocaleDateString() : 'N/A'}
                      </div>
                      {tenant.leaseStatus === 'EXPIRING_SOON' && (
                        <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Ends in &lt; 30 days
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5">
                      <div
                        className={`font-bold ${
                          balanceInfo.balance > 0
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {formatKES(balanceInfo.balance)}
                      </div>
                      <span className="text-[10px] text-gray-400">
                        {balanceInfo.status === 'PAID'
                          ? 'Zero Arrears'
                          : balanceInfo.status === 'PARTIAL'
                          ? 'Partial Paid'
                          : `${balanceInfo.daysOverdue}d overdue`}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          balanceInfo.status === 'PAID'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : balanceInfo.status === 'CREDIT'
                            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                            : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        {balanceInfo.status}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTenant(tenant);
                        }}
                        className="text-xs font-semibold text-[#2F8A68] dark:text-[#79C8A4] hover:underline"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tenant Detail Drawer */}
      {selectedTenant && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white dark:bg-[#1B2622] h-full overflow-y-auto p-6 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-[#E2E8E5] dark:border-[#2D4039]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#173C32] dark:bg-[#79C8A4] text-white dark:text-[#111A17] flex items-center justify-center font-bold text-lg shadow-sm">
                    {selectedTenant.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {selectedTenant.name}
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      ID: {selectedTenant.nationalIdOrPassport} • {selectedTenant.email}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedTenant(null)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tenancy & Financial Status Bar */}
              {(() => {
                const balanceInfo = getTenantBalance(selectedTenant.id);
                const unit = units.find((u) => u.id === selectedTenant.assignedUnitId);
                const prop = properties.find((p) => p.id === selectedTenant.assignedPropertyId);

                return (
                  <div className="mt-4 grid grid-cols-2 gap-3 bg-[#F6F8F6] dark:bg-[#24332D] p-3.5 rounded-xl text-xs">
                    <div>
                      <span className="text-[10px] text-gray-400 block">Assigned Unit</span>
                      <span className="font-bold text-gray-900 dark:text-gray-100">
                        {unit?.unitNumber} ({prop?.name})
                      </span>
                      <span className="text-[11px] text-gray-500 block">
                        Rent: {formatKES(unit?.monthlyRent || 0)} + SC: {formatKES(unit?.serviceCharge || 0)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-400 block">Current Balance</span>
                      <span
                        className={`font-extrabold text-sm ${
                          balanceInfo.balance > 0 ? 'text-amber-600' : 'text-emerald-600'
                        }`}
                      >
                        {formatKES(balanceInfo.balance)}
                      </span>
                      <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-white dark:bg-[#1B2622] inline-block mt-0.5">
                        {balanceInfo.status}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* WhatsApp Communication Timeline */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    WhatsApp Thread (Simulated)
                  </h3>
                  <span className="text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                    Tenant WhatsApp Link
                  </span>
                </div>

                <div className="bg-[#EFEAE2]/30 dark:bg-gray-900/40 p-3.5 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3 max-h-56 overflow-y-auto">
                  {whatsappMessages
                    .filter((m) => m.tenantId === selectedTenant.id)
                    .map((msg) => {
                      const isLandlord = msg.sender === 'LANDLORD' || msg.sender === 'AI_AGENT';
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isLandlord ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[85%] p-2.5 rounded-xl text-xs ${
                              isLandlord
                                ? 'bg-[#E7FFDB] dark:bg-[#1A3828] text-gray-900 dark:text-gray-100 shadow-xs'
                                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-xs'
                            }`}
                          >
                            <div className="font-semibold text-[10px] text-emerald-800 dark:text-emerald-300 mb-0.5">
                              {msg.sender === 'AI_AGENT' ? '🤖 Kejahub Agent' : msg.sender === 'LANDLORD' ? '👤 Landlord' : selectedTenant.name}
                            </div>
                            <p>{msg.message}</p>
                            <span className="text-[9px] text-gray-400 block text-right mt-1">
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Simulated
                            </span>
                          </div>
                        </div>
                      );
                    })}

                  {whatsappMessages.filter((m) => m.tenantId === selectedTenant.id).length === 0 && (
                    <div className="text-center py-4 text-xs text-gray-400">
                      No WhatsApp messages logged for this tenant yet.
                    </div>
                  )}
                </div>

                {/* Message composer */}
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={waText}
                    onChange={(e) => setWaText(e.target.value)}
                    placeholder="Type WhatsApp message to tenant..."
                    className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-[#2F8A68]"
                  />
                  <button
                    onClick={handleSendWhatsApp}
                    className="px-3 py-1.5 bg-[#2F8A68] hover:bg-[#267256] text-white text-xs font-semibold rounded-xl flex items-center gap-1 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" /> Send
                  </button>
                </div>
              </div>

              {/* Maintenance History */}
              <div className="mt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  Maintenance Reported
                </h3>
                <div className="space-y-2">
                  {maintenanceTickets
                    .filter((m) => m.tenantId === selectedTenant.id)
                    .map((m) => (
                      <div
                        key={m.id}
                        className="p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 text-xs flex justify-between items-center"
                      >
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-gray-100">{m.title}</div>
                          <span className="text-[10px] text-gray-400">Est: {formatKES(m.estimatedCost)}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          {m.status}
                        </span>
                      </div>
                    ))}
                  {maintenanceTickets.filter((m) => m.tenantId === selectedTenant.id).length === 0 && (
                    <p className="text-xs text-gray-400">No maintenance tickets logged.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedTenant(null);
                  setIsAssistantOpen(true);
                }}
                className="text-xs font-semibold text-[#2F8A68] dark:text-[#79C8A4] flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" /> Ask Agent to Audit Lease
              </button>

              <button
                onClick={() => setSelectedTenant(null)}
                className="px-4 py-2 text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Tenant Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#1B2622] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
              Register New Tenant & Lease
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Create a tenancy agreement with assigned unit and deposit record.
            </p>

            <form onSubmit={handleCreateTenant} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Victor Mutiso"
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    WhatsApp Phone (+254...) *
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+254 7..."
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    National ID / Passport No.
                  </label>
                  <input
                    type="text"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    placeholder="e.g. 31892019"
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Select Property
                  </label>
                  <select
                    value={propertyId}
                    onChange={(e) => {
                      setPropertyId(e.target.value);
                      setUnitId('');
                    }}
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                  >
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Assign Unit *
                  </label>
                  <select
                    required
                    value={unitId}
                    onChange={(e) => setUnitId(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                  >
                    <option value="">Select vacant unit</option>
                    {units
                      .filter((u) => u.propertyId === propertyId)
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          Unit {u.unitNumber} ({u.typeLabel} - KES {formatKES(u.monthlyRent)}) {u.status !== 'VACANT' ? `[${u.status}]` : ''}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Lease Start Date
                  </label>
                  <input
                    type="date"
                    value={leaseStart}
                    onChange={(e) => setLeaseStart(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Lease End Date
                  </label>
                  <input
                    type="date"
                    value={leaseEnd}
                    onChange={(e) => setLeaseEnd(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:text-[#111A17] rounded-xl"
                >
                  Confirm Tenancy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
