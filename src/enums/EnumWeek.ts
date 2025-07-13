const DaysWeek = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

export const convertWeekDaysToNumber = (weekDays: string[]): number[] => {
  return weekDays.map(
    (weekDay: string) => DaysWeek[weekDay as keyof typeof DaysWeek],
  );
};
