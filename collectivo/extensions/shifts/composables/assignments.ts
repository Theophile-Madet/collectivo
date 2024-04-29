import { DateTime } from "luxon";
import {
  getNextOccurrence,
  isShiftDurationModelActive,
  shiftToRRule,
} from "~/composables/shifts";

export const isNextOccurrenceWithinAssignment = (
  assignment: ShiftsAssignment,
): boolean => {
  if (typeof assignment.shifts_slot == "number") {
    throw new Error("assignment.shifts_slot field must be loaded");
  }

  if (typeof assignment.shifts_slot.shifts_shift == "number") {
    throw new Error("assignment.shifts_slot.shifts_shift field must be loaded");
  }

  const nextOccurrence = getNextOccurrence(assignment.shifts_slot.shifts_shift);

  return (
    !!nextOccurrence &&
    isShiftDurationModelActive(assignment, nextOccurrence.start)
  );
};

export const getActiveAssignment = (
  assignments: ShiftsAssignment[],
  atDate?: DateTime,
): ShiftsAssignment | null => {
  for (const assignment of assignments) {
    if (isShiftDurationModelActive(assignment, atDate)) return assignment;
  }

  return null;
};

export const getAssigneeName = (
  assignments: ShiftsAssignment[],
  atDate?: DateTime,
) => {
  if (!atDate) {
    atDate = DateTime.now();
  }

  const assignment = getActiveAssignment(assignments, atDate);

  if (!assignment)
    return "No assignee on " + atDate.toLocaleString(DateTime.DATE_SHORT);

  if (typeof assignment.shifts_user == "string") {
    throw new Error("Assignment shifts_user field must be loaded");
  }

  return (
    assignment.shifts_user.first_name +
    " " +
    assignment.shifts_user.last_name[0] +
    "."
  );
};

export const hasActivePermanentAssignment = (
  assignments: ShiftsAssignment[],
  atDate?: DateTime,
) => {
  if (!atDate) {
    atDate = DateTime.now();
  }

  const assignment = getActiveAssignment(assignments, atDate);
  if (!assignment) return false;

  return assignment.shifts_to == undefined;
};

export const capAssignmentToFirstAndLastIncludedOccurrence = (
  assignment: ShiftsAssignment,
) => {
  if (typeof assignment.shifts_slot == "number") {
    throw new Error("assignment.shifts_slot field must be loaded");
  }

  if (typeof assignment.shifts_slot.shifts_shift == "number") {
    throw new Error("assignment.shifts_slot.shifts_shift field must be loaded");
  }

  const rrule = shiftToRRule(assignment.shifts_slot.shifts_shift);

  const firstOccurrenceWithinAssignment = rrule.after(
    DateTime.fromISO(assignment.shifts_from).toJSDate(),
  );

  if (firstOccurrenceWithinAssignment) {
    assignment.shifts_from = DateTime.fromJSDate(
      firstOccurrenceWithinAssignment,
    )
      .startOf("day")
      .toISO()!;
  }

  console.log("CAPPING");
  if (!assignment.shifts_to) return;
  console.log("CAPPING 2");

  const lastOccurrenceWithinAssignment = rrule.before(
    DateTime.fromISO(assignment.shifts_to).toJSDate(),
    true,
  );

  console.log(lastOccurrenceWithinAssignment);

  if (!lastOccurrenceWithinAssignment) return;
  console.log("CAPPING 3");

  assignment.shifts_to = DateTime.fromJSDate(lastOccurrenceWithinAssignment)
    .endOf("day")
    .toISO()!;

  console.log(assignment.shifts_to);
};