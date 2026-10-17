import React, { useState } from 'react';
import { useProperty } from '../../context/PropertyContext';
import { AgentTask, AgentTaskStatus } from '../../types';
import {
  Bot,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  X,
  ListTodo,
  Settings2,
  History,
  Check,
  ArrowRight,
  ShieldAlert,
  Sliders,
  ChevronRight,
} from 'lucide-react';
import { formatKES } from '../../utils/propertyMath';

export const AgentWorkspaceView: React.FC = () => {
  const {
    agentTasks,
    automationRules,
    auditLogs,
    tenants,
    properties,
    units,
    transactions,
    approveAgentTask,
    rejectAgentTask,
    toggleAutomationRule,
    currentUser,
    addToast,
    setIsAssistantOpen,
  } = useProperty();

  const [activeTab, setActiveTab] = useState<'TASKS' | 'APPROVALS' | 'AUTOMATIONS' | 'AUDIT'>('APPROVALS');
  const [selectedTask, setSelectedTask] = useState<AgentTask | null>(
    agentTasks.find((t) => t.status === 'AWAITING_APPROVAL') || agentTasks[0] || null
  );
  const [taskFilter, setTaskFilter] = useState<'ALL' | AgentTaskStatus>('ALL');

  const pendingApprovals = agentTasks.filter((t) => t.status === 'AWAITING_APPROVAL');

  const filteredTasks = agentTasks.filter((t) => {
    if (taskFilter === 'ALL') return true;
    return t.status === taskFilter;
  });

  const handleApprove = (task: AgentTask) => {
    const success = approveAgentTask(task.id);
    if (success && selectedTask?.id === task.id) {
      setSelectedTask({ ...task, status: 'COMPLETED' });
    }
  };

  const handleReject = (task: AgentTask) => {
    rejectAgentTask(task.id);
    if (selectedTask?.id === task.id) {
      setSelectedTask({ ...task, status: 'CANCELLED' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#173C32] dark:bg-[#79C8A4] flex items-center justify-center text-white dark:text-[#111A17] shadow-md">
            <Sparkles className="w-6 h-6 text-emerald-300 dark:text-[#111A17]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#24312D] dark:text-[#EDF5F1] tracking-tight">
                AI Agent Hub & Sentinel
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                Active Guardian
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#64736C] dark:text-[#9EB2A9]">
              Autonomous task orchestration, plan verification, and human authorization control
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAssistantOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:hover:bg-[#93D6B7] text-white dark:text-[#111A17] rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm"
        >
          <Bot className="w-4 h-4" />
          <span>Launch Chat Session</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E8E5] dark:border-[#2D4039] pb-1 overflow-x-auto">
        {[
          { id: 'APPROVALS', label: 'Approval Centre', badge: pendingApprovals.length, icon: ShieldAlert },
          { id: 'TASKS', label: 'All Agent Tasks', badge: agentTasks.length, icon: ListTodo },
          { id: 'AUTOMATIONS', label: 'Automation Rules', badge: automationRules.length, icon: Sliders },
          { id: 'AUDIT', label: 'Audit Trail', badge: auditLogs.length, icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#173C32] text-white dark:bg-[#79C8A4] dark:text-[#111A17] shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? 'bg-white/20 text-white dark:bg-black/20 dark:text-[#111A17]'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: APPROVAL CENTRE */}
      {activeTab === 'APPROVALS' && (
        <div className="space-y-4">
          <div className="bg-emerald-50/70 dark:bg-emerald-950/30 p-4 rounded-2xl border border-emerald-500/20 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-sm">Human-in-the-Loop Safeguards Active</span>
              <p className="mt-0.5 leading-relaxed text-emerald-800/80 dark:text-emerald-300/80">
                Kejahub Agent never executes rent waivers, lease amendments, mass WhatsApp messages, or high-cost repairs without verified Landlord signoff.
              </p>
            </div>
          </div>

          {pendingApprovals.length === 0 ? (
            <div className="bg-white dark:bg-[#1B2622] p-12 text-center rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039]">
              <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500 mb-3" />
              <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">
                All Pending Approvals Cleared
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                No tasks are currently waiting for your authorization. The Agent is operating safely within autonomous boundaries.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {pendingApprovals.map((task) => (
                <div
                  key={task.id}
                  className="bg-white dark:bg-[#1B2622] rounded-2xl border-2 border-emerald-500/30 p-5 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Awaiting Landlord Signoff
                      </span>
                      <span className="text-xs font-mono text-gray-400">#{task.id}</span>
                    </div>

                    <h3 className="font-extrabold text-base text-gray-900 dark:text-gray-100">
                      {task.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                      {task.description}
                    </p>

                    {/* Proposed changes summary */}
                    {task.proposedChangesSummary && (
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-xs border border-gray-100 dark:border-gray-800">
                        <span className="text-[10px] font-bold uppercase text-gray-400 block mb-1">
                          Impact & Side Effects:
                        </span>
                        <p className="text-gray-700 dark:text-gray-200">{task.proposedChangesSummary}</p>
                      </div>
                    )}

                    {/* Plan Steps preview */}
                    <div className="mt-4 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase text-gray-400 block">
                        Execution Plan:
                      </span>
                      {task.planSteps.map((step, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs">
                          <span
                            className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                              step.status === 'DONE'
                                ? 'bg-emerald-500 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            {step.status === 'DONE' ? <Check className="w-2.5 h-2.5" /> : idx + 1}
                          </span>
                          <span
                            className={
                              step.status === 'DONE'
                                ? 'line-through text-gray-400'
                                : 'text-gray-800 dark:text-gray-200 font-medium'
                            }
                          >
                            {step.step}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleReject(task)}
                      className="px-3.5 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                    >
                      Reject / Dismiss
                    </button>
                    <button
                      onClick={() => handleApprove(task)}
                      className="px-4 py-2 text-xs font-semibold text-white bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:hover:bg-[#93D6B7] dark:text-[#111A17] rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve & Execute Task</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ALL AGENT TASKS (Plan details and queue) */}
      {activeTab === 'TASKS' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Col: Task Queue */}
          <div className="bg-white dark:bg-[#1B2622] rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">
                Task Queue ({filteredTasks.length})
              </h3>
              <select
                value={taskFilter}
                onChange={(e) => setTaskFilter(e.target.value as any)}
                className="text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 text-gray-800 dark:text-gray-200"
              >
                <option value="ALL">All Statuses</option>
                <option value="AWAITING_APPROVAL">Awaiting Approval</option>
                <option value="PROPOSED">Proposed</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div className="space-y-2.5 max-h-[600px] overflow-y-auto">
              {filteredTasks.map((t) => {
                const isSelected = selectedTask?.id === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTask(t)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer text-xs ${
                      isSelected
                        ? 'border-[#2F8A68] bg-[#173C32]/5 dark:bg-[#79C8A4]/10 shadow-xs'
                        : 'border-gray-100 dark:border-gray-800 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-gray-400">#{t.id}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                          t.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : t.status === 'AWAITING_APPROVAL'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                        }`}
                      >
                        {t.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="font-bold text-gray-900 dark:text-gray-100 line-clamp-1">{t.title}</div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">
                      {t.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 2 Cols: Task Details & Execution Plan */}
          <div className="lg:col-span-2 bg-white dark:bg-[#1B2622] rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] p-6 shadow-xs">
            {selectedTask ? (
              <div className="space-y-5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#2F8A68] dark:text-[#79C8A4]">
                      {selectedTask.category.replace('_', ' ')} • {selectedTask.safetyLevel}
                    </span>
                    <h2 className="text-lg font-extrabold text-gray-900 dark:text-gray-100 mt-0.5">
                      {selectedTask.title}
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Created: {new Date(selectedTask.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      selectedTask.status === 'COMPLETED'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : selectedTask.status === 'AWAITING_APPROVAL'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                    }`}
                  >
                    {selectedTask.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Requested Outcome */}
                <div className="p-3.5 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-gray-400 uppercase text-[10px] block">
                    Requested Goal:
                  </span>
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
                    {selectedTask.requestedOutcome}
                  </p>
                </div>

                {/* Execution Plan Checklist */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2.5">
                    Plan Execution Steps
                  </h4>
                  <div className="space-y-2">
                    {selectedTask.planSteps.map((step, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs ${
                              step.status === 'DONE'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-600'
                            }`}
                          >
                            {step.status === 'DONE' ? <Check className="w-3 h-3" /> : idx + 1}
                          </span>
                          <span className={step.status === 'DONE' ? 'line-through text-gray-400' : 'font-medium'}>
                            {step.step}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold ${
                            step.status === 'DONE' ? 'text-emerald-600' : 'text-gray-400'
                          }`}
                        >
                          {step.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Result Summary */}
                {selectedTask.resultSummary && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300">
                    <span className="font-bold block text-[10px] uppercase">Execution Result:</span>
                    <p className="mt-0.5">{selectedTask.resultSummary}</p>
                  </div>
                )}

                {/* Actions */}
                {selectedTask.status === 'AWAITING_APPROVAL' && (
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-2">
                    <button
                      onClick={() => handleReject(selectedTask)}
                      className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                    >
                      Reject Task
                    </button>
                    <button
                      onClick={() => handleApprove(selectedTask)}
                      className="px-5 py-2 text-xs font-semibold text-white bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:text-[#111A17] rounded-xl flex items-center gap-1.5 shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Authorize Execution</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-gray-400">
                Select a task from the left queue to view execution breakdown.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: AUTOMATION RULES */}
      {activeTab === 'AUTOMATIONS' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#1B2622] p-5 rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] shadow-xs">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
              Active Automation Policies & Safety Thresholds
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Control when the Agent acts autonomously versus when it must queue tasks for human review.
            </p>

            <div className="space-y-3">
              {automationRules.map((rule) => (
                <div
                  key={rule.id}
                  className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30 flex items-start justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 dark:text-gray-100 text-sm">{rule.name}</span>
                      {rule.requiresLandlordApproval && (
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-0.2 rounded-full">
                          Approval Required
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{rule.description}</p>
                    <div className="text-[10px] text-gray-400 pt-1">
                      Trigger: <span className="font-mono text-gray-700 dark:text-gray-300">{rule.triggerEvent}</span> • Action: {rule.actionSummary}
                    </div>
                  </div>

                  <button
                    onClick={() => toggleAutomationRule(rule.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all shrink-0 ${
                      rule.enabled
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                        : 'bg-gray-200 dark:bg-gray-800 text-gray-500'
                    }`}
                  >
                    {rule.enabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT TRAIL */}
      {activeTab === 'AUDIT' && (
        <div className="bg-white dark:bg-[#1B2622] rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] p-5 shadow-xs">
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
            System & Agent Audit Trail
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Immutable log of all automated recommendations, human authorizations, and executed actions
          </p>

          <div className="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 mt-0.5 ${
                      log.actor === 'AI_AGENT'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : log.actor === 'LANDLORD'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                    }`}
                  >
                    {log.actor}
                  </span>
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-gray-100 font-mono text-[11px]">
                      {log.action}
                    </span>
                    <p className="text-gray-600 dark:text-gray-400 mt-0.5">{log.details}</p>
                  </div>
                </div>

                <span className="text-[10px] text-gray-400 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
