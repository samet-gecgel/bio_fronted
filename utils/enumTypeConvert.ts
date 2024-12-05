import { EducationLevel } from "@/types/enums/educationLevel";
import { EmployeesRange } from "@/types/enums/employeesRange";
import { ExperienceLevel } from "@/types/enums/experienceLevel";
import { JobType } from "@/types/enums/jobType";
import { WeekDay } from "@/types/enums/weekDay";

export const jobTypeLabels: Record<JobType, string> = {
    [JobType.Hourly]: "Saatlik",
    [JobType.Daily]: "Günlük",
    [JobType.FullTime]: "Tam Zamanlı",
    [JobType.PartTime]: "Yarı Zamanlı",
    [JobType.Internship]: "Stajyer",
  };
  
  export const educationLevelLabels: Record<EducationLevel, string> = {
    [EducationLevel.Primary]: "İlkokul",
    [EducationLevel.Secondary]: "Ortaokul",
    [EducationLevel.HighSchool]: "Lise",
    [EducationLevel.Bachelor]: "Lisans",
    [EducationLevel.Master]: "Yüksek Lisans",
    [EducationLevel.Doctorate]: "Doktora ve Üzeri",
  };
  
  export const experienceLevelLabels: Record<ExperienceLevel, string> = {
    [ExperienceLevel.Experienced]: "Tecrübeli",
    [ExperienceLevel.Inexperienced]: "Tecrübesiz",
  };

  export const weekDayLabels: Record<WeekDay, string> = {
    [WeekDay.Monday] : "Pazartesi",
    [WeekDay.Tuesday] : "Salı",
    [WeekDay.Wednesday] : "Çarşamba",
    [WeekDay.Thursday] : "Perşembe",
    [WeekDay.Friday] : "Cuma",
    [WeekDay.Saturday] : "Cumartesi",
    [WeekDay.Sunday] : "Pazar"
  }

  export const employeesRangeLabels: Record<EmployeesRange, string> = {
    [EmployeesRange.OneToFive] : "1-5",
    [EmployeesRange.SixToTen] : "6-10",
    [EmployeesRange.ElevenToTwenty] : "11-20",
    [EmployeesRange.TwentyOneToFifty] : "21-50",
    [EmployeesRange.FiftyOneToOneHundred] : "51-100",
    [EmployeesRange.OverOneHundred] : "100+"
  }

  export const formatOffDaysEnum = (offDays: number | null): string => {
    if (!offDays || offDays === WeekDay.None) return "Belirtilmedi";
  
    const selectedDays = Object.keys(weekDayLabels)
      .map(Number)
      .filter((day) => (offDays & day) !== 0) 
      .map((day) => weekDayLabels[day as WeekDay]);
  
    return selectedDays.length > 0 ? selectedDays.join(", ") : "Belirtilmedi";
  };

  export const formatEducationLevelsEnum = (educationLevel : number | null) : string => {
    if(!educationLevel || educationLevel === EducationLevel.None) return "Belirtilmedi";

    const selectedEducationLevels = Object.keys(educationLevelLabels)
    .map(Number)
    .filter((education) => (educationLevel & education) !== 0)
    .map((education) => educationLevelLabels[education as EducationLevel]);

    return selectedEducationLevels.length > 0 ? selectedEducationLevels.join(", ") : "Belirtilmedi";
  }

  export const formatWeekDaysEnum = (weekDays: number | null): string => {
    if(!weekDays || weekDays === WeekDay.None) return "Belirtilmedi";

    const selectedWeekDays = Object.keys(weekDayLabels)
    .map(Number)
    .filter((day) => (weekDays & day) !== 0)
    .map((day) => weekDayLabels[day as WeekDay]);
    
    return selectedWeekDays.length > 0 ? selectedWeekDays.join(", ") : "Belirtilmedi";
  }
  