import Link from 'next/link';
// import { IFrame } from './iframe';
import { Card, Text, Metric } from '@tremor/react';
import fetchJsonp from 'fetch-jsonp';
import {
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from '@tremor/react';
import '@tremor/react/dist/esm/tremor.css';
import { useState, useEffect } from 'react';
const fundList = [
  '009076',
  '001217',
  '001832',
  '162605',
  '002096',
  '005794',
  '001508',
  '007449',
  '008928',
  '002340',
  '004075',
  '001718',
  '260108',
  '161005',
  '001410',
  '163406',
  '005827',
  '001714',
  '002846',
  '000006',
  '006228',
  '015455',
  '519702',
];

const date = new Date();
const api =
  `https://api.doctorxiong.club/v1/fund/detail/list?` +
  new URLSearchParams({
    code: fundList.join(','),
    startDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
  });

const ttFundApi = `https://fund.eastmoney.com/pingzhongdata/${519702}.js`;

const FundTable = ({ data, managerData }) => {
  // console.log(data, managerData, 'render');
  return (
    <Card>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell> 名称 </TableHeaderCell>
            <TableHeaderCell textAlignment="text-right">代码</TableHeaderCell>
            <TableHeaderCell textAlignment="text-right">规模</TableHeaderCell>
            <TableHeaderCell textAlignment="text-right">规模</TableHeaderCell>
            <TableHeaderCell textAlignment="text-right">经理</TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data?.map((item) => (
            <TableRow key={item.code}>
              <TableCell>{item.name}</TableCell>
              <TableCell textAlignment="text-right">{item.code}</TableCell>
              <TableCell textAlignment="text-right">{item.fundScale}</TableCell>
              <TableCell textAlignment="text-right">
                {
                  managerData.find((data) => data.code === item.code)
                    ?.manager[0].fundSize
                }
              </TableCell>
              <TableCell textAlignment="text-right">{item.manager}</TableCell>
              {/* <TableCell textAlignment="text-right">{item.quota}</TableCell>
              <TableCell textAlignment="text-right">{item.variance}</TableCell>
              <TableCell textAlignment="text-right">{item.region}</TableCell>
              <TableCell textAlignment="text-right">
                <BadgeDelta
                  deltaType={item.deltaType}
                  text={item.delta}
                  size="xs"
                />
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

// const IFrame = <iframe srcDoc="<p>Your html</p>" />;

export default function Home() {
  const [fundData, setFundData] = useState([]);
  const [iframeSrc, setIframeSrc] = useState(`/iframe.html`);
  const [fundIndex, setFundIndex] = useState(0);
  const [managerData, setManagerData] = useState([]);

  const fetchData = async () => {
    const response = await fetch(api);
    const data = await response.json();
    setFundData([...data.data]);
  };

  const fetchTTData = async () => {
    return;
    const response = await fetchJsonp(ttFundApi, {
      jsonpCallback: 'jsonpgz',
    });
    const data = await response.json();
    console.log(data, 'tt');
  };

  const getMessage = (ev) => {
    // console.log(ev);
    if (ev.data.source === 'fund') {
      setFundIndex((pre) => pre + 1);
      // console.log('message', ev.data.payload);
      setManagerData((pre) => [...pre, ev.data.payload]);
    }
  };

  useEffect(() => {
    // console.log('触发渲染？');
    window.addEventListener('message', getMessage, false);
    fetchData();
    fetchTTData();
    return () => window.removeEventListener('message', getMessage);
  }, []);

  useEffect(() => {
    // console.log(fundIndex, '触发');
    if (fundIndex < fundList.length) {
      setIframeSrc(
        `/iframe.html?fundsrc=https://fund.eastmoney.com/pingzhongdata/${fundList[fundIndex]}.js`
      );
    }
  }, [fundIndex]);

  return (
    <main className="p-6 sm:p-10 bg-slate-50 h-full">
      <FundTable data={fundData} managerData={managerData} />
      {/* <iframe src={iframeSrc} /> */}
      {fundList.map((code) => (
        <iframe
          key={code}
          src={`/iframe.html?fundsrc=https://fund.eastmoney.com/pingzhongdata/${code}.js`}
        />
      ))}
    </main>
  );
}
