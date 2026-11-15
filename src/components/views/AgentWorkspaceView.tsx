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

import { GSAPEntrance } from '../animation/GSAPEntrance';
import { StatusBadge } from '../ui/StatusBadge';

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
    <GSAPEntrance className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-[#173C32] dark:bg-[#79C8A4] flex items-center justify-center text-white dark:text-[#111A17] shadow-md shrink-0">
            <Sparkles className="w-6 h-6 text-emerald-300 dark:text-[#111A17]" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#24312D] dark:text-[#EDF5F1] tracking-tight text-balance">
                AI Agent Hub & Sentinel
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                Active Guardian
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#64736C] dark:text-[#9EB2A9]">
              Autonomous task orchestration, plan verification, and human authorization control
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAssistantOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:hover:bg-[#93D6B7] text-white dark:text-[#111A17] rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm shrink-0 self-start sm:self-auto min-h-[38px]"
        >
          <Bot className="w-4 h-4" aria-hidden="true" />
          <span>Launch Chat Session</span>
        </button>
      </div>

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Agent workspace sections"
        className="flex items-center gap-2 border-b border-[#E2E8E5] dark:border-[#2D4039] pb-1.5 overflow-x-auto"
      >
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
              type="button"
              role="tab"
              id={`agent-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`agent-panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id as 'TASKS' | 'APPROVALS' | 'AUTOMATIONS' | 'AUDIT')}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-[#173C32] text-white dark:bg-[#79C8A4] dark:text-[#111A17] shadow-xs'
                  : 'text-[#64736C] dark:text-[#9EB2A9] hover:text-[#24312D] dark:hover:text-[#EDF5F1] hover:bg-[#F0F4F2] dark:hover:bg-[#24332D]'
              }`}
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold tabular-nums ${
                    isActive
                      ? 'bg-white/20 text-white dark:bg-black/20 dark:text-[#111A17]'
                      : 'bg-[#E2E8E5] dark:bg-[#2D4039] text-[#24312D] dark:text-[#EDF5F1]'
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
        <div id="agent-panel-APPROVALS" role="tabpanel" aria-labelledby="agent-tab-APPROVALS" className="space-y-4">
          <div className="bg-emerald-50/70 dark:bg-emerald-950/30 p-4 rounded-2xl border border-emerald-500/20 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="font-bold block text-sm">Human-in-the-Loop Safeguards Active</span>
              <p className="mt-0.5 leading-relaxed text-emerald-800/90 dark:text-emerald-300/90">
                Kejahub Agent never executes rent waivers, lease amendments, mass WhatsApp messages, or high-cost repairs without verified Landlord signoff.
              </p>
            </div>
          </div>

          {pendingApprovals.length === 0 ? (
            <div className="bg-white dark:bg-[#1B2622] p-12 text-center rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039]">
              <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-600 dark:text-emerald-400 mb-3" aria-hidden="true" />
              <h3 className="font-bold text-base text-[#24312D] dark:text-[#EDF5F1]">
                All Pending Approvals Cleared
              </h3>
              <p className="text-xs text-[#64736C] dark:text-[#9EB2A9] mt-1">
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
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap">
                        <Clock className="w-3 h-3" aria-hidden="true" /> Awaiting Landlord Signoff
                      </span>
                      <span className="text-xs font-mono text-[#64736C] dark:text-[#9EB2A9] tabular-nums">#{task.id}</span>
                    </div>

                    <h3 className="font-extrabold text-base text-[#24312D] dark:text-[#EDF5F1] wrap-anywhere">
                      {task.title}
                    </h3>
                    <p className="text-xs text-[#64736C] dark:text-[#9EB2A9] mt-2 leading-relaxed">
                      {task.description}
                    </p>

                    {/* Proposed changes summary */}
                    {task.proposedChangesSummary && (
                      <div className="mt-3 p-3 bg-[#F6F8F6] dark:bg-[#202D28] rounded-xl text-xs border border-[#E2E8E5] dark:border-[#2D4039]">
                        <span className="text-[10px] font-bold uppercase text-[#64736C] dark:text-[#9EB2A9] block mb-1">
                          Impact & Side Effects:
                        </span>
                        <p className="text-[#24312D] dark:text-[#EDF5F1]">{task.proposedChangesSummary}</p>
                      </div>
                    )}

                    {/* Plan Steps preview */}
                    <div className="mt-4 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase text-[#64736C] dark:text-[#9EB2A9] block">
                        Execution Plan:
                      </span>
                      {task.planSteps.map((step, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs">
                          <span
                            className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 tabular-nums ${
                              step.status === 'DONE'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-[#E2E8E5] dark:bg-[#2D4039] text-[#24312D] dark:text-[#EDF5F1]'
                            }`}
                          >
                            {step.status === 'DONE' ? <Check className="w-2.5 h-2.5" aria-hidden="true" /> : idx + 1}
                          </span>
                          <span
                            className={
                              step.status === 'DONE'
                                ? 'line-through text-[#64736C] dark:text-[#9EB2A9]'
                                : 'text-[#24312D] dark:text-[#EDF5F1] font-medium'
                            }
                          >
                            {step.step}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E2E8E5] dark:border-[#2D4039] flex flex-wrap items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleReject(task)}
                      className="px-3.5 py-2 text-xs font-semibold text-[#64736C] dark:text-[#9EB2A9] hover:bg-[#F0F4F2] dark:hover:bg-[#24332D] rounded-xl transition-colors"
                    >
                      Reject / Dismiss
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApprove(task)}
                      className="px-4 py-2 text-xs font-semibold text-white bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:hover:bg-[#93D6B7] dark:text-[#111A17] rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                    >
                      <Check className="w-3.5 h-3.5" aria-hidden="true" />
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
        <div id="agent-panel-TASKS" role="tabpanel" aria-labelledby="agent-tab-TASKS" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Col: Task Queue */}
          <div className="bg-white dark:bg-[#1B2622] rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] p-4 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="font-bold text-sm text-[#24312D] dark:text-[#EDF5F1] tabular-nums">
                Task Queue ({filteredTasks.length})
              </h3>
              <select
                aria-label="Filter agent tasks by status"
                value={taskFilter}
                onChange={(e) => setTaskFilter(e.target.value as 'ALL' | AgentTaskStatus)}
                className="text-xs bg-[#F6F8F6] dark:bg-[#202D28] border border-[#E2E8E5] dark:border-[#2D4039] rounded-lg px-2 py-1 text-[#24312D] dark:text-[#EDF5F1]"
              >
                <option value="ALL">All Statuses</option>
                <option value="AWAITING_APPROVAL">Awaiting Approval</option>
                <option value="PROPOSED">Proposed</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            {filteredTasks.length === 0 ? (
              <div className="py-10 text-center text-xs text-[#64736C] dark:text-[#9EB2A9]">
                <p>No agent tasks match this status filter.</p>
                {taskFilter !== 'ALL' && (
                  <button
                    type="button"
                    onClick={() => setTaskFilter('ALL')}
                    className="mt-3 px-3 py-1.5 rounded-lg bg-[#F0F4F2] hover:bg-[#E2E8E5] dark:bg-[#24332D] dark:hover:bg-[#2D4039] text-[#24312D] dark:text-[#EDF5F1] font-semibold"
                  >
                    Show all tasks
                  </button>
                )}
              </div>
            ) : (
            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-0.5">
              {filteredTasks.map((t) => {
                const isSelected = selectedTask?.id === t.id;
                return (
                  <button
                    type="button"
                    key={t.id}
                    aria-current={isSelected ? 'true' : undefined}
                    onClick={() => setSelectedTask(t)}
                    className={`w-full text-left p-3 rounded-xl border transition-all text-xs ${
                      isSelected
                        ? 'border-[#2F8A68] bg-[#173C32]/5 dark:bg-[#79C8A4]/10 shadow-xs'
                        : 'border-[#E2E8E5] dark:border-[#2D4039] hover:border-[#2F8A68]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-mono text-[#64736C] dark:text-[#9EB2A9] tabular-nums">#{t.id}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                          t.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : t.status === 'AWAITING_APPROVAL'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-[#F0F4F2] text-[#64736C] dark:bg-[#24332D] dark:text-[#9EB2A9]'
                        }`}
                      >
                        {t.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="font-bold text-[#24312D] dark:text-[#EDF5F1] line-clamp-1">{t.title}</div>
                    <p className="text-[11px] text-[#64736C] dark:text-[#9EB2A9] line-clamp-2 mt-0.5">
                      {t.description}
                    </p>
                  </button>
                );
              })}
            </div>
            )}
          </div>

          {/* Right 2 Cols: Task Details & Execution Plan */}
          <div className="lg:col-span-2 bg-white dark:bg-[#1B2622] rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] p-6 shadow-xs">
            {selectedTask ? (
              <div className="space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#267256] dark:text-[#79C8A4]">
                      {selectedTask.category.replace(/_/g, ' ')} • {selectedTask.safetyLevel}
                    </span>
                    <h2 className="text-lg font-extrabold text-[#24312D] dark:text-[#EDF5F1] mt-0.5 wrap-anywhere">
                      {selectedTask.title}
                    </h2>
                    <p className="text-xs text-[#64736C] dark:text-[#9EB2A9] mt-1 tabular-nums">
                      Created: {new Date(selectedTask.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap shrink-0 ${
                      selectedTask.status === 'COMPLETED'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : selectedTask.status === 'AWAITING_APPROVAL'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-[#F0F4F2] text-[#24312D] dark:bg-[#24332D] dark:text-[#EDF5F1]'
                    }`}
                  >
                    {selectedTask.status.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Requested Outcome */}
                <div className="p-3.5 bg-[#F6F8F6] dark:bg-[#202D28] rounded-xl text-xs space-y-1">
                  <span className="font-bold text-[#64736C] dark:text-[#9EB2A9] uppercase text-[10px] block">
                    Requested Goal:
                  </span>
                  <p className="text-[#24312D] dark:text-[#EDF5F1] leading-relaxed font-medium">
                    {selectedTask.requestedOutcome}
                  </p>
                </div>

                {/* Execution Plan Checklist */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#64736C] dark:text-[#9EB2A9] mb-2.5">
                    Plan Execution Steps
                  </h4>
                  <div className="space-y-2">
                    {selectedTask.planSteps.map((step, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-[#E2E8E5] dark:border-[#2D4039] bg-[#F6F8F6]/60 dark:bg-[#202D28]/60 flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs shrink-0 tabular-nums ${
                              step.status === 'DONE'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-[#E2E8E5] dark:bg-[#2D4039] text-[#24312D] dark:text-[#EDF5F1]'
                            }`}
                          >
                            {step.status === 'DONE' ? <Check className="w-3 h-3" aria-hidden="true" /> : idx + 1}
                          </span>
                          <span className={step.status === 'DONE' ? 'line-through text-[#64736C] dark:text-[#9EB2A9]' : 'font-medium text-[#24312D] dark:text-[#EDF5F1]'}>
                            {step.step}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold shrink-0 ${
                            step.status === 'DONE' ? 'text-emerald-700 dark:text-emerald-400' : 'text-[#64736C] dark:text-[#9EB2A9]'
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
                  <div className="pt-4 border-t border-[#E2E8E5] dark:border-[#2D4039] flex flex-wrap justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleReject(selectedTask)}
                      className="px-4 py-2 text-xs font-semibold text-[#64736C] dark:text-[#9EB2A9] hover:bg-[#F0F4F2] dark:hover:bg-[#24332D] rounded-xl"
                    >
                      Reject Task
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApprove(selectedTask)}
                      className="px-5 py-2 text-xs font-semibold text-white bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:hover:bg-[#93D6B7] dark:text-[#111A17] rounded-xl flex items-center gap-1.5 shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Authorize Execution</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-[#64736C] dark:text-[#9EB2A9]">
                Select a task from the left queue to view execution breakdown.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: AUTOMATION RULES */}
      {activeTab === 'AUTOMATIONS' && (
        <div id="agent-panel-AUTOMATIONS" role="tabpanel" aria-labelledby="agent-tab-AUTOMATIONS" className="space-y-4">
          <div className="bg-white dark:bg-[#1B2622] p-5 rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] shadow-xs">
            <h3 className="text-sm font-bold text-[#24312D] dark:text-[#EDF5F1] mb-1">
              Active Automation Policies & Safety Thresholds
            </h3>
            <p className="text-xs text-[#64736C] dark:text-[#9EB2A9] mb-4">
              Control when the Agent acts autonomously versus when it must queue tasks for human review.
            </p>

            <div className="space-y-3">
              {automationRules.map((rule) => (
                <div
                  key={rule.id}
                  className="p-4 rounded-xl border border-[#E2E8E5] dark:border-[#2D4039] bg-[#F6F8F6]/60 dark:bg-[#202D28]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-4 text-xs"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-[#24312D] dark:text-[#EDF5F1] text-sm">{rule.name}</span>
                      {rule.requiresLandlordApproval && (
                        <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-full whitespace-nowrap">
                          Approval Required
                        </span>
                      )}
                    </div>
                    <p className="text-[#64736C] dark:text-[#9EB2A9] leading-relaxed">{rule.description}</p>
                    <div className="text-[11px] text-[#64736C] dark:text-[#9EB2A9] pt-1 wrap-anywhere">
                      Trigger: <span className="font-mono text-[#24312D] dark:text-[#EDF5F1]">{rule.triggerEvent}</span> • Action: {rule.actionSummary}
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-pressed={rule.enabled}
                    aria-label={`${rule.enabled ? 'Disable' : 'Enable'} automation rule ${rule.name}`}
                    onClick={() => toggleAutomationRule(rule.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all shrink-0 self-start ${
                      rule.enabled
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900'
                        : 'bg-[#E2E8E5] dark:bg-[#2D4039] text-[#64736C] dark:text-[#9EB2A9] hover:text-[#24312D] dark:hover:text-[#EDF5F1]'
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
        <div id="agent-panel-AUDIT" role="tabpanel" aria-labelledby="agent-tab-AUDIT" className="bg-white dark:bg-[#1B2622] rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] p-5 shadow-xs">
          <h3 className="text-sm font-bold text-[#24312D] dark:text-[#EDF5F1] mb-1">
            System & Agent Audit Trail
          </h3>
          <p className="text-xs text-[#64736C] dark:text-[#9EB2A9] mb-4">
            Immutable log of all automated recommendations, human authorizations, and executed actions
          </p>

          <div className="divide-y divide-[#E2E8E5] dark:divide-[#2D4039] text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 mt-0.5 whitespace-nowrap ${
                      log.actor === 'AI_AGENT'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : log.actor === 'LANDLORD'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                        : 'bg-[#F0F4F2] text-[#24312D] dark:bg-[#24332D] dark:text-[#EDF5F1]'
                    }`}
                  >
                    {log.actor}
                  </span>
                  <div className="min-w-0">
                    <span className="font-semibold text-[#24312D] dark:text-[#EDF5F1] font-mono text-[11px] wrap-anywhere">
                      {log.action}
                    </span>
                    <p className="text-[#64736C] dark:text-[#9EB2A9] mt-0.5 wrap-anywhere">{log.details}</p>
                  </div>
                </div>

                <span className="text-[11px] text-[#64736C] dark:text-[#9EB2A9] whitespace-nowrap tabular-nums shrink-0">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </GSAPEntrance>
  );
};
