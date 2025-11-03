import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  appointments: any[];
}

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss']
})
export class CalendarViewComponent implements OnInit {
  @Input() isVisible = false;
  @Input() appointments: any[] = [];
  @Output() onClose = new EventEmitter<void>();
  @Output() onDateSelect = new EventEmitter<Date>();

  currentDate = new Date();
  currentMonth = new Date();
  calendarDays: CalendarDay[] = [];
  
  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  ngOnInit(): void {
    this.generateCalendar();
  }

  ngOnChanges(): void {
    if (this.appointments) {
      this.generateCalendar();
    }
  }

  generateCalendar(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Start from the first day of the week containing the first day of the month
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // End at the last day of the week containing the last day of the month
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    
    this.calendarDays = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dayAppointments = this.getAppointmentsForDate(currentDate);
      
      this.calendarDays.push({
        date: new Date(currentDate),
        day: currentDate.getDate(),
        isCurrentMonth: currentDate.getMonth() === month,
        isToday: this.isToday(currentDate),
        appointments: dayAppointments
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  getAppointmentsForDate(date: Date): any[] {
    const dateString = date.toISOString().split('T')[0];
    return this.appointments.filter(appointment => 
      appointment.date === dateString
    );
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  previousMonth(): void {
    this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
    this.generateCalendar();
  }

  goToToday(): void {
    this.currentMonth = new Date();
    this.generateCalendar();
  }

  onDayClick(day: CalendarDay): void {
    if (day.isCurrentMonth) {
      this.onDateSelect.emit(day.date);
    }
  }

  onCloseCalendar(): void {
    this.onClose.emit();
  }

  getAppointmentStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'scheduled': 'bg-blue-500',
      'confirmed': 'bg-green-500',
      'completed': 'bg-purple-500',
      'cancelled': 'bg-red-500',
      'pending': 'bg-yellow-500'
    };
    return statusClasses[status.toLowerCase()] || 'bg-gray-500';
  }

  formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }
}