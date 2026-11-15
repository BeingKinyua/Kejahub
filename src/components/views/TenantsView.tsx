import React, { useState, useEffect } from 'react';
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
  Bot,
  User,
} from 'lucide-react';
import { formatKES } from '../../utils/propertyMath';
import { GSAPEntrance } from '../animation/GSAPEntrance';

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

  // Close active modal/drawer on Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (addModalOpen) {
        setAddModalOpen(false);
      } else if (selectedTenant) {
        setSelectedTenant(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [addModalOpen, selectedTenant]);

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
    <GSAPEntrance className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#24312D] dark:text-[#EDF5F1] tracking-tight text-balance">
            Tenants &amp; Leases
          </h1>
          <p className="text-xs sm:text-sm text-[#64736C] dark:text-[#9EB2A9]">
            Tenant registry, active agreements, balances, and WhatsApp communications
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {currentUser.role !== 'READ_ONLY' && (
            <button
              type="button"
              onClick={() => setAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:hover:bg-[#93D6B7] text-white dark:text-[#111A17] rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Register Tenant</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#64736C] dark:text-[#9EB2A9] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
          <input
            type="search"
            aria-label="Search tenants by name, phone, or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by tenant name, phone (+254...), email..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white dark:bg-[#1B2622] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1] placeholder-[#64736C] dark:placeholder-[#9EB2A9] focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
          />
        </div>

        <div
          role="group"
          aria-label="Filter tenants by lease or payment status"
          className="flex flex-wrap items-center gap-1 bg-[#F0F4F2] dark:bg-[#24332D] p-1 rounded-xl text-xs self-start sm:self-auto"
        >
          {(['ALL', 'ACTIVE', 'OVERDUE', 'EXPIRING_SOON'] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              aria-pressed={statusFilter === filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === filter
                  ? 'bg-white dark:bg-[#1B2622] text-[#24312D] dark:text-[#EDF5F1] shadow-xs font-semibold'
                  : 'text-[#64736C] dark:text-[#9EB2A9] hover:text-[#24312D] dark:hover:text-[#EDF5F1]'
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

      {/* Tenants Table or Empty State */}
      {filteredTenants.length === 0 ? (
        <div className="bg-white dark:bg-[#1B2622] rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] p-10 text-center">
          <Users className="w-8 h-8 mx-auto text-[#64736C] dark:text-[#9EB2A9] mb-2" aria-hidden="true" />
          <h2 className="text-sm font-bold text-[#24312D] dark:text-[#EDF5F1]">
            No matching tenants found
          </h2>
          <p className="text-xs text-[#64736C] dark:text-[#9EB2A9] mt-1">
            Adjust your search query or status filter to view tenant records.
          </p>
          {(searchTerm || statusFilter !== 'ALL') && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('ALL');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-[#F0F4F2] dark:bg-[#24332D] text-[#24312D] dark:text-[#EDF5F1] hover:bg-[#E2E8E5] dark:hover:bg-[#2D4039] cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#1B2622] rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#24312D] dark:text-[#EDF5F1]">
              <thead className="bg-[#F6F8F6] dark:bg-[#24332D] uppercase text-[10px] font-bold text-[#64736C] dark:text-[#9EB2A9] border-b border-[#E2E8E5] dark:border-[#2D4039]">
                <tr>
                  <th className="px-4 py-3">Tenant Details</th>
                  <th className="px-4 py-3">Assigned Unit</th>
                  <th className="px-4 py-3">Lease Period</th>
                  <th className="px-4 py-3">October Balance</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8E5] dark:divide-[#2D4039]">
                {filteredTenants.map((tenant) => {
                  const unit = units.find((u) => u.id === tenant.assignedUnitId);
                  const property = properties.find((p) => p.id === tenant.assignedPropertyId);
                  const balanceInfo = getTenantBalance(tenant.id);

                  return (
                    <tr
                      key={tenant.id}
                      tabIndex={0}
                      onClick={() => setSelectedTenant(tenant)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedTenant(tenant);
                        }
                      }}
                      className="hover:bg-[#F6F8F6] dark:hover:bg-[#202D28]/60 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2F8A68]"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div
                            aria-hidden="true"
                            className="w-8 h-8 rounded-full bg-[#173C32]/10 dark:bg-[#79C8A4]/20 text-[#173C32] dark:text-[#79C8A4] font-bold flex items-center justify-center shrink-0"
                          >
                            {tenant.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-[#24312D] dark:text-[#EDF5F1]">{tenant.name}</div>
                            <div className="text-[11px] text-[#64736C] dark:text-[#9EB2A9] flex items-center gap-1 tabular-nums">
                              <Phone className="w-3 h-3 text-[#267256] dark:text-[#79C8A4] shrink-0" aria-hidden="true" />
                              <span>{tenant.phone}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-[#24312D] dark:text-[#EDF5F1]">
                          Unit {unit?.unitNumber || 'Unassigned'}
                        </div>
                        <div className="text-[11px] text-[#64736C] dark:text-[#9EB2A9] truncate max-w-[160px]">
                          {property?.name}
                        </div>
                      </td>

                      <td className="px-4 py-3.5 tabular-nums">
                        <div className="font-medium text-[#24312D] dark:text-[#EDF5F1]">
                          {tenant.leaseEnd ? new Date(tenant.leaseEnd).toLocaleDateString() : 'N/A'}
                        </div>
                        {tenant.leaseStatus === 'EXPIRING_SOON' && (
                          <span className="text-[11px] font-bold text-purple-700 dark:text-purple-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 shrink-0" aria-hidden="true" /> Ends in &lt; 30 days
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 tabular-nums">
                        <div
                          className={`font-bold ${
                            balanceInfo.balance > 0
                              ? 'text-amber-700 dark:text-amber-400'
                              : 'text-[#267256] dark:text-[#79C8A4]'
                          }`}
                        >
                          {formatKES(balanceInfo.balance)}
                        </div>
                        <span className="text-[11px] text-[#64736C] dark:text-[#9EB2A9]">
                          {balanceInfo.status === 'PAID'
                            ? 'Zero Arrears'
                            : balanceInfo.status === 'PARTIAL'
                            ? 'Partial Paid'
                            : `${balanceInfo.daysOverdue}d overdue`}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
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
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTenant(tenant);
                          }}
                          className="text-xs font-semibold text-[#267256] dark:text-[#79C8A4] hover:underline cursor-pointer"
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
      )}

      {/* Tenant Detail Drawer */}
      {selectedTenant && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex justify-end backdrop-blur-xs"
          onClick={() => setSelectedTenant(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="tenant-drawer-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-white dark:bg-[#1B2622] h-full overflow-y-auto p-6 shadow-2xl flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#E2E8E5] dark:border-[#2D4039]">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    aria-hidden="true"
                    className="w-12 h-12 rounded-2xl bg-[#173C32] dark:bg-[#79C8A4] text-white dark:text-[#111A17] flex items-center justify-center font-bold text-lg shadow-sm shrink-0"
                  >
                    {selectedTenant.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h2 id="tenant-drawer-title" className="text-lg font-bold text-[#24312D] dark:text-[#EDF5F1]">
                      {selectedTenant.name}
                    </h2>
                    <p className="text-xs text-[#64736C] dark:text-[#9EB2A9] wrap-anywhere tabular-nums">
                      ID: {selectedTenant.nationalIdOrPassport} • {selectedTenant.email}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="Close tenant details"
                  onClick={() => setSelectedTenant(null)}
                  className="p-2 rounded-lg text-[#64736C] dark:text-[#9EB2A9] hover:text-[#24312D] dark:hover:text-[#EDF5F1] hover:bg-[#F0F4F2] dark:hover:bg-[#24332D] cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              {/* Tenancy & Financial Status Bar */}
              {(() => {
                const balanceInfo = getTenantBalance(selectedTenant.id);
                const unit = units.find((u) => u.id === selectedTenant.assignedUnitId);
                const prop = properties.find((p) => p.id === selectedTenant.assignedPropertyId);

                return (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#F6F8F6] dark:bg-[#24332D] p-3.5 rounded-xl text-xs">
                    <div>
                      <span className="text-[11px] text-[#64736C] dark:text-[#9EB2A9] block">Assigned Unit</span>
                      <span className="font-bold text-[#24312D] dark:text-[#EDF5F1]">
                        {unit?.unitNumber} ({prop?.name})
                      </span>
                      <span className="text-[11px] text-[#64736C] dark:text-[#9EB2A9] block tabular-nums">
                        Rent: {formatKES(unit?.monthlyRent || 0)} + SC: {formatKES(unit?.serviceCharge || 0)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] text-[#64736C] dark:text-[#9EB2A9] block">Current Balance</span>
                      <span
                        className={`font-extrabold text-sm tabular-nums block ${
                          balanceInfo.balance > 0 ? 'text-amber-700 dark:text-amber-400' : 'text-[#267256] dark:text-[#79C8A4]'
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
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#64736C] dark:text-[#9EB2A9] flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-[#267256] dark:text-[#79C8A4]" aria-hidden="true" />
                    <span>WhatsApp Thread (Simulated)</span>
                  </h3>
                  <span className="text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                    Tenant WhatsApp Link
                  </span>
                </div>

                <div className="bg-[#EFEAE2]/30 dark:bg-[#111A17]/50 p-3.5 rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] space-y-3 max-h-56 overflow-y-auto">
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
                                ? 'bg-[#E7FFDB] dark:bg-[#1A3828] text-[#24312D] dark:text-[#EDF5F1] shadow-xs'
                                : 'bg-white dark:bg-[#24332D] text-[#24312D] dark:text-[#EDF5F1] shadow-xs'
                            }`}
                          >
                            <div className="font-semibold text-[11px] text-emerald-800 dark:text-emerald-300 mb-0.5 flex items-center gap-1">
                              {msg.sender === 'AI_AGENT' ? (
                                <>
                                  <Bot className="w-3 h-3 shrink-0" aria-hidden="true" />
                                  <span>Kejahub Agent</span>
                                </>
                              ) : msg.sender === 'LANDLORD' ? (
                                <>
                                  <User className="w-3 h-3 shrink-0" aria-hidden="true" />
                                  <span>Landlord</span>
                                </>
                              ) : (
                                <span>{selectedTenant.name}</span>
                              )}
                            </div>
                            <p className="wrap-anywhere leading-relaxed">{msg.message}</p>
                            <span className="text-[10px] text-[#64736C] dark:text-[#9EB2A9] block text-right mt-1 tabular-nums">
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Simulated
                            </span>
                          </div>
                        </div>
                      );
                    })}

                  {whatsappMessages.filter((m) => m.tenantId === selectedTenant.id).length === 0 && (
                    <div className="text-center py-4 text-xs text-[#64736C] dark:text-[#9EB2A9]">
                      No WhatsApp messages logged for this tenant yet.
                    </div>
                  )}
                </div>

                {/* Message composer */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendWhatsApp();
                  }}
                  className="mt-2 flex gap-2"
                >
                  <input
                    type="text"
                    aria-label="WhatsApp message to tenant"
                    value={waText}
                    onChange={(e) => setWaText(e.target.value)}
                    placeholder="Type WhatsApp message to tenant..."
                    className="flex-1 px-3 py-2 text-xs bg-white dark:bg-[#24332D] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1] focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
                  />
                  <button
                    type="submit"
                    disabled={!waText.trim()}
                    className="px-3.5 py-2 bg-[#2F8A68] hover:bg-[#267256] disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center gap-1 shadow-xs cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Send className="w-3.5 h-3.5" aria-hidden="true" /> Send
                  </button>
                </form>
              </div>

              {/* Maintenance History */}
              <div className="mt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#64736C] dark:text-[#9EB2A9] mb-2">
                  Maintenance Reported
                </h3>
                <div className="space-y-2">
                  {maintenanceTickets
                    .filter((m) => m.tenantId === selectedTenant.id)
                    .map((m) => (
                      <div
                        key={m.id}
                        className="p-2.5 rounded-xl border border-[#E2E8E5] dark:border-[#2D4039] bg-[#F6F8F6] dark:bg-[#24332D]/40 text-xs flex justify-between items-center gap-2"
                      >
                        <div className="min-w-0">
                          <div className="font-semibold text-[#24312D] dark:text-[#EDF5F1] truncate">{m.title}</div>
                          <span className="text-[11px] text-[#64736C] dark:text-[#9EB2A9] tabular-nums">Est: {formatKES(m.estimatedCost)}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 shrink-0 whitespace-nowrap">
                          {m.status}
                        </span>
                      </div>
                    ))}
                  {maintenanceTickets.filter((m) => m.tenantId === selectedTenant.id).length === 0 && (
                    <p className="text-xs text-[#64736C] dark:text-[#9EB2A9]">No maintenance tickets logged.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 mt-6 border-t border-[#E2E8E5] dark:border-[#2D4039] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedTenant(null);
                  setIsAssistantOpen(true);
                }}
                className="text-xs font-semibold text-[#267256] dark:text-[#79C8A4] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" /> Ask Agent to Audit Lease
              </button>

              <button
                type="button"
                onClick={() => setSelectedTenant(null)}
                className="px-4 py-2 text-xs font-semibold bg-[#F0F4F2] dark:bg-[#24332D] text-[#24312D] dark:text-[#EDF5F1] rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Tenant Modal */}
      {addModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setAddModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-tenant-title"
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#1B2622] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E2E8E5] dark:border-[#2D4039] max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 id="add-tenant-title" className="text-lg font-bold text-[#24312D] dark:text-[#EDF5F1]">
                Register New Tenant &amp; Lease
              </h3>
              <button
                type="button"
                aria-label="Close modal"
                onClick={() => setAddModalOpen(false)}
                className="p-1.5 rounded-lg text-[#64736C] dark:text-[#9EB2A9] hover:text-[#24312D] dark:hover:text-[#EDF5F1] hover:bg-[#F0F4F2] dark:hover:bg-[#24332D] cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
            <p className="text-xs text-[#64736C] dark:text-[#9EB2A9] mb-4">
              Create a tenancy agreement with assigned unit and deposit record.
            </p>

            <form onSubmit={handleCreateTenant} className="space-y-4">
              <div>
                <label htmlFor="tenant-name" className="block text-xs font-semibold text-[#24312D] dark:text-[#EDF5F1] mb-1">
                  Full Name *
                </label>
                <input
                  id="tenant-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Victor Mutiso"
                  className="w-full px-3 py-2 text-sm bg-[#F6F8F6] dark:bg-[#24332D] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="tenant-phone" className="block text-xs font-semibold text-[#24312D] dark:text-[#EDF5F1] mb-1">
                    WhatsApp Phone (+254...) *
                  </label>
                  <input
                    id="tenant-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+254 7..."
                    className="w-full px-3 py-2 text-sm bg-[#F6F8F6] dark:bg-[#24332D] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1]"
                  />
                </div>

                <div>
                  <label htmlFor="tenant-id-num" className="block text-xs font-semibold text-[#24312D] dark:text-[#EDF5F1] mb-1">
                    National ID / Passport No.
                  </label>
                  <input
                    id="tenant-id-num"
                    type="text"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    placeholder="e.g. 31892019"
                    className="w-full px-3 py-2 text-sm tabular-nums bg-[#F6F8F6] dark:bg-[#24332D] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="tenant-property" className="block text-xs font-semibold text-[#24312D] dark:text-[#EDF5F1] mb-1">
                    Select Property
                  </label>
                  <select
                    id="tenant-property"
                    value={propertyId}
                    onChange={(e) => {
                      setPropertyId(e.target.value);
                      setUnitId('');
                    }}
                    className="w-full px-3 py-2 text-sm bg-[#F6F8F6] dark:bg-[#24332D] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1]"
                  >
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="tenant-unit" className="block text-xs font-semibold text-[#24312D] dark:text-[#EDF5F1] mb-1">
                    Assign Unit *
                  </label>
                  <select
                    id="tenant-unit"
                    required
                    value={unitId}
                    onChange={(e) => setUnitId(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-[#F6F8F6] dark:bg-[#24332D] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1]"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="tenant-lease-start" className="block text-xs font-semibold text-[#24312D] dark:text-[#EDF5F1] mb-1">
                    Lease Start Date
                  </label>
                  <input
                    id="tenant-lease-start"
                    type="date"
                    value={leaseStart}
                    onChange={(e) => setLeaseStart(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-[#F6F8F6] dark:bg-[#24332D] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1]"
                  />
                </div>

                <div>
                  <label htmlFor="tenant-lease-end" className="block text-xs font-semibold text-[#24312D] dark:text-[#EDF5F1] mb-1">
                    Lease End Date
                  </label>
                  <input
                    id="tenant-lease-end"
                    type="date"
                    value={leaseEnd}
                    onChange={(e) => setLeaseEnd(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-[#F6F8F6] dark:bg-[#24332D] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1]"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-[#E2E8E5] dark:border-[#2D4039]">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#64736C] dark:text-[#9EB2A9] hover:bg-[#F0F4F2] dark:hover:bg-[#24332D] rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:text-[#111A17] rounded-xl cursor-pointer"
                >
                  Confirm Tenancy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </GSAPEntrance>
  );
};
