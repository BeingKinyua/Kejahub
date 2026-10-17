import React, { useState } from 'react';
import { useProperty } from '../../context/PropertyContext';
import { MaintenanceTicket, TicketPriority, TicketStatus } from '../../types';
import {
  Wrench,
  Search,
  Plus,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Phone,
  MessageSquare,
  Sparkles,
  X,
  User,
  ShieldCheck,
  Building,
  Image,
} from 'lucide-react';
import { formatKES } from '../../utils/propertyMath';

export const MaintenanceView: React.FC = () => {
  const {
    maintenanceTickets,
    properties,
    units,
    tenants,
    createMaintenanceTicket,
    updateMaintenanceStatus,
    approveMaintenanceTicket,
    currentUser,
    workspaceConfig,
    addToast,
  } = useProperty();

  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | TicketPriority>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | TicketStatus>('ALL');
  const [selectedTicket, setSelectedTicket] = useState<MaintenanceTicket | null>(null);

  // New Ticket Modal State
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [propertyId, setPropertyId] = useState(properties[0]?.id || '');
  const [unitId, setUnitId] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('MEDIUM');
  const [estimatedCost, setEstimatedCost] = useState(5000);
  const [assigneeName, setAssigneeName] = useState('Fundi Joseph (Plumber)');
  const [assigneePhone, setAssigneePhone] = useState('+254 710 445 566');

  // WhatsApp Simulation Intake Modal
  const [simModalOpen, setSimModalOpen] = useState(false);
  const [simTenantMsg, setSimTenantMsg] = useState(
    'Habari David, main shower switch in Unit A3 is buzzing and sparking whenever we turn on the instant shower head. It smells burnt.'
  );

  const filteredTickets = maintenanceTickets.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.assigneeName && m.assigneeName.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;
    if (priorityFilter !== 'ALL' && m.priority !== priorityFilter) return false;
    if (statusFilter !== 'ALL' && m.status !== statusFilter) return false;
    return true;
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !propertyId) {
      addToast('ERROR', 'Missing Fields', 'Title, description, and property are required.');
      return;
    }

    createMaintenanceTicket({
      title,
      description,
      propertyId,
      unitId: unitId || undefined,
      priority,
      status: estimatedCost > workspaceConfig.maintenanceApprovalThreshold ? 'AWAITING_APPROVAL' : 'ASSIGNED',
      estimatedCost: Number(estimatedCost),
      assigneeName,
      assigneePhone,
      assigneeRole: 'Contractor',
    });

    setNewModalOpen(false);
    setTitle('');
    setDescription('');
  };

  const handleSimulateWhatsAppReport = () => {
    // AI Triage Simulation
    createMaintenanceTicket({
      title: 'Electrical Spark in Shower Switch (Urgent Fire Risk)',
      description: simTenantMsg,
      propertyId: properties[0].id,
      unitId: units[0].id,
      tenantId: tenants[0]?.id,
      priority: 'EMERGENCY',
      status: 'AWAITING_APPROVAL',
      estimatedCost: 12000,
      assigneeName: 'Apex Certified Electricians Nairobi',
      assigneePhone: '+254 722 990 011',
      whatsappSimulatedMessage: simTenantMsg,
    });
    setSimModalOpen(false);
    addToast('SUCCESS', 'WhatsApp Ingested by AI', 'Parsed message, set EMERGENCY priority, and assigned certified electrician quote.');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#24312D] dark:text-[#EDF5F1] tracking-tight">
            Maintenance & Repairs
          </h1>
          <p className="text-xs sm:text-sm text-[#64736C] dark:text-[#9EB2A9]">
            Tenant service tickets, fundi assignments, quotes, and expenditure approvals
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSimModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-semibold border border-emerald-500/20 transition-all shadow-xs"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>Simulate WhatsApp Ingest</span>
          </button>

          {currentUser.role !== 'READ_ONLY' && (
            <button
              onClick={() => setNewModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:hover:bg-[#93D6B7] text-white dark:text-[#111A17] rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>New Ticket</span>
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
            placeholder="Search tickets by title, issue, or fundi..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white dark:bg-[#1B2622] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="px-3 py-1.5 bg-white dark:bg-[#1B2622] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-gray-800 dark:text-gray-200"
          >
            <option value="ALL">All Priorities</option>
            <option value="EMERGENCY">Emergency</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 bg-white dark:bg-[#1B2622] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-gray-800 dark:text-gray-200"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New</option>
            <option value="AWAITING_APPROVAL">Awaiting Approval</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTickets.map((ticket) => {
          const prop = properties.find((p) => p.id === ticket.propertyId);
          const unit = units.find((u) => u.id === ticket.unitId);
          const isHighCost = ticket.estimatedCost > workspaceConfig.maintenanceApprovalThreshold;

          return (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className="bg-white dark:bg-[#1B2622] rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] p-5 shadow-xs hover:border-[#2F8A68] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        ticket.priority === 'EMERGENCY'
                          ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                          : ticket.priority === 'HIGH'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      }`}
                    >
                      {ticket.priority}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">#{ticket.id}</span>
                  </div>

                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                      ticket.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : ticket.status === 'AWAITING_APPROVAL'
                        ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 font-bold'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                    }`}
                  >
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 leading-snug">
                  {ticket.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                  {ticket.description}
                </p>

                {ticket.whatsappSimulatedMessage && (
                  <div className="mt-2.5 p-2 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-lg text-[11px] text-emerald-800 dark:text-emerald-300 flex items-start gap-1.5 border border-emerald-500/10">
                    <MessageSquare className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-600" />
                    <span className="line-clamp-1 italic">"{ticket.whatsappSimulatedMessage}"</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-gray-400 block">
                    {prop?.name} {unit ? `• Unit ${unit.unitNumber}` : '• Common Area'}
                  </span>
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    Est: {formatKES(ticket.estimatedCost)}
                  </span>
                </div>

                {ticket.status === 'AWAITING_APPROVAL' && currentUser.role === 'LANDLORD' ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      approveMaintenanceTicket(ticket.id);
                    }}
                    className="px-3 py-1.5 bg-[#173C32] hover:bg-[#245245] text-white text-xs font-semibold rounded-lg shadow-xs"
                  >
                    Authorize Quote
                  </button>
                ) : (
                  <span className="text-gray-400 text-xs">
                    Assignee: <strong className="text-gray-700 dark:text-gray-300">{ticket.assigneeName || 'Unassigned'}</strong>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Ticket Details Drawer */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-[#1B2622] h-full overflow-y-auto p-6 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right">
            <div>
              <div className="flex items-start justify-between pb-4 border-b border-[#E2E8E5] dark:border-[#2D4039]">
                <div>
                  <span className="text-[10px] font-mono text-gray-400">Ticket #{selectedTicket.id}</span>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {selectedTicket.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status and Action banner */}
              <div className="my-4 p-3.5 bg-[#F6F8F6] dark:bg-[#24332D] rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px]">Current Status</span>
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    {selectedTicket.status.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Estimated Quote</span>
                  <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                    {formatKES(selectedTicket.estimatedCost)}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Issue Details</span>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-gray-800/40 p-3 rounded-xl">
                    {selectedTicket.description}
                  </p>
                </div>

                {selectedTicket.whatsappSimulatedMessage && (
                  <div>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
                      Tenant WhatsApp Audio/Text Ingest
                    </span>
                    <p className="text-emerald-800 dark:text-emerald-300 italic bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/20">
                      "{selectedTicket.whatsappSimulatedMessage}"
                    </p>
                  </div>
                )}

                <div className="p-3 border border-gray-200 dark:border-gray-800 rounded-xl space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fundi / Contractor:</span>
                    <span className="font-semibold">{selectedTicket.assigneeName || 'Pending'}</span>
                  </div>
                  {selectedTicket.assigneePhone && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Contact:</span>
                      <span className="font-mono">{selectedTicket.assigneePhone}</span>
                    </div>
                  )}
                  {selectedTicket.approvedBy && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Approved By:</span>
                      <span className="font-semibold text-emerald-600">{selectedTicket.approvedBy}</span>
                    </div>
                  )}
                </div>

                {/* Workflow Status Controls */}
                <div className="pt-2">
                  <span className="font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
                    Progress Workflow Status
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['ASSIGNED', 'IN_PROGRESS', 'RESOLVED'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => {
                          updateMaintenanceStatus(selectedTicket.id, st);
                          setSelectedTicket({ ...selectedTicket, status: st });
                        }}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold border transition-all ${
                          selectedTicket.status === st
                            ? 'bg-[#173C32] text-white dark:bg-[#79C8A4] dark:text-[#111A17] border-transparent'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        {st.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
              {selectedTicket.status === 'AWAITING_APPROVAL' && (
                <button
                  onClick={() => {
                    approveMaintenanceTicket(selectedTicket.id);
                    setSelectedTicket(null);
                  }}
                  className="px-4 py-2 bg-[#173C32] hover:bg-[#245245] text-white text-xs font-semibold rounded-xl"
                >
                  Authorize Work Order Quote
                </button>
              )}
              <button
                onClick={() => setSelectedTicket(null)}
                className="ml-auto px-4 py-2 text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Intake Simulator Modal */}
      {simModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#1B2622] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                Simulate Tenant WhatsApp Audio/Text
              </h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Demonstrates how Kejahub Agent ingests raw tenant WhatsApp chats, categorizes urgency, estimates quotes, and routes for Landlord signoff.
            </p>

            <textarea
              rows={4}
              value={simTenantMsg}
              onChange={(e) => setSimTenantMsg(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
            />

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSimModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSimulateWhatsAppReport}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:text-[#111A17] rounded-xl flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" /> Ingest & Triage Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Maintenance Ticket Modal */}
      {newModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#1B2622] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
              Create Maintenance Ticket
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Record repairs, vendor assignment, and budget estimation.
            </p>

            <form onSubmit={handleCreateTicket} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Issue Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Borehole pressure sensor fault"
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Detailed Description *
                </label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe root cause and required materials..."
                  className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Property
                  </label>
                  <select
                    value={propertyId}
                    onChange={(e) => setPropertyId(e.target.value)}
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
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="EMERGENCY">Emergency</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Estimated Cost (KES)
                  </label>
                  <input
                    type="number"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                  />
                  {estimatedCost > workspaceConfig.maintenanceApprovalThreshold && (
                    <span className="text-[10px] text-amber-600 block mt-0.5">
                      &gt; KES 10,000 will require Landlord approval
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Fundi Name
                  </label>
                  <input
                    type="text"
                    value={assigneeName}
                    onChange={(e) => setAssigneeName(e.target.value)}
                    placeholder="Fundi Joseph"
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setNewModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:text-[#111A17] rounded-xl"
                >
                  Create Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
