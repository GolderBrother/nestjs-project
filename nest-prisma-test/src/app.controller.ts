import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { DepartmentService } from './department.service';
import { EmployeeService } from './employee.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Inject(DepartmentService)
  private departmentService: DepartmentService;

  @Inject(EmployeeService)
  private employeeService: EmployeeService;

  @Get('create')
  async create() {
    // 创建一个 department，再创建一个 employee。
    const departmemt = await this.departmentService.create({
      name: '技术部',
    });
    await this.employeeService.create({
      name: 'james',
      phone: '12345678',
      department: {
        connect: {
          id: departmemt.id,
        },
      },
    });

    return 'success';
  }
}
