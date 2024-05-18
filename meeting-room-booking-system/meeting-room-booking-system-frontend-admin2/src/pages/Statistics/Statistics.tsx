import { Button, DatePicker, Form, Select, message } from "antd";
import "./statistics.css";
import { useRef, useEffect, useState } from "react";
import * as echarts from 'echarts';
import dayjs from "dayjs";
import { MeetingRoomUsedData, UserBookingData, meetingRoomUsedCount, userBookingCount } from "../../api/statistics";
import { useForm } from "antd/es/form/Form";

export function Statistics() {
  const userBookingChartContainerRef = useRef<HTMLDivElement | null>(null);
  const [userBookingData, setUserBookingData] = useState<Array<UserBookingData>>();
  const [form] = useForm();


  const meetRoomUsedChartContainerRef = useRef<HTMLDivElement | null>(null);
  const [meetingRoomUsedData, setMeetingRoomUsedData] = useState<Array<MeetingRoomUsedData>>();


  async function getStatisticData(values: { startTime: string; endTime: string; }) {
    const startTime = dayjs(values.startTime).format('YYYY-MM-DD');
    const endTime = dayjs(values.endTime).format('YYYY-MM-DD');

    // 用户预订情况
    await fetchUserBookingData(startTime, endTime);
    // 会议室使用情况
    await fetchMeetingRoomUsedData(startTime, endTime);
  }

  /**
   * 用户预订情况
   * @param startTime 
   * @param endTime 
   */
  async function fetchUserBookingData(startTime: string, endTime: string) {
    const bookingCountRes = await userBookingCount(startTime, endTime);
    const { data } = bookingCountRes.data;
    if (bookingCountRes.status === 201 || bookingCountRes.status === 200) {
      setUserBookingData(data);
    } else {
      message.error(data || '[userBookingCount]: 系统繁忙，请稍后再试');
    }
  }

  /**
   * 会议室使用情况
   * @param startTime 
   * @param endTime 
   */
  async function fetchMeetingRoomUsedData(startTime: string, endTime: string) {
    const meetingRoomUsedCountRes = await meetingRoomUsedCount(startTime, endTime);
    const { data: data2 } = meetingRoomUsedCountRes.data;
    if (meetingRoomUsedCountRes.status === 201 || meetingRoomUsedCountRes.status === 200) {
      setMeetingRoomUsedData(data2);
    } else {
      message.error(data2 || '[meetingRoomUsedCount]: 系统繁忙，请稍后再试');
    }
  }

  useEffect(() => {
    const myChart = echarts.init(userBookingChartContainerRef.current);
    if (!userBookingData) {
      return;
    }
    renderUserBookingChart(myChart, userBookingData, form);
  }, [form, userBookingData]);

  useEffect(() => {
    const myChart = echarts.init(meetRoomUsedChartContainerRef.current);
    if (!meetingRoomUsedData) {
      return;
    }
    renderMeetingRoomUsedChart(myChart, meetingRoomUsedData, form);
  }, [form, meetingRoomUsedData]);

  function renderUserBookingChart(chart: any, data: any[], form: any) {
    chart.setOption({
      title: {
        text: '用户预定情况'
      },
      tooltip: {},
      xAxis: {
        data: data?.map(item => item.username)
      },
      yAxis: {},
      series: [
        {
          name: '预定次数',
          type: form.getFieldValue('chartType') || 'bar',
          data: data?.map(item => {
            return {
              name: item.username,
              value: item.bookingCount
            }
          })
        }
      ]
    });
  }

  function renderMeetingRoomUsedChart(chart: any, data: any[], form: any) {
    chart.setOption({
      title: {
        text: '会议室使用情况'
      },
      tooltip: {},
      xAxis: {
        data: data?.map(item => item.meetingRoomName)
      },
      yAxis: {},
      series: [
        {
          name: '使用次数',
          type: form.getFieldValue('chartType'),
          data: data?.map(item => {
            return {
              name: item.meetingRoomName,
              value: item.usedCount
            }
          })
        }
      ]
    });
  }

  return <div id="statistics-container">
    <div className="statistics-form">
      <Form
        onFinish={getStatisticData}
        name="search"
        layout='inline'
        colon={false}
      >
        <Form.Item label="开始日期" name="startTime">
          <DatePicker placeholder="请选择" />
        </Form.Item>

        <Form.Item label="结束日期" name="endTime">
          <DatePicker placeholder="请选择" />
        </Form.Item>

        <Form.Item label="图表类型" name="chartType" initialValue={"bar"}>
          <Select>
            <Select.Option value="pie">饼图</Select.Option>
            <Select.Option value="bar">柱形图</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </Form.Item>
      </Form>
    </div>
    {/* 用户预订情况 */}
    <div className="statistics-chart" ref={userBookingChartContainerRef}></div>
    {/* 会议室使用情况 */}
    <div className="statistics-chart" ref={meetRoomUsedChartContainerRef}></div>
  </div>
}
