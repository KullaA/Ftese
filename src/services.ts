import { wedding } from './config';
export async function submit(kind: 'rsvp'|'wish', payload: Record<string, unknown>) {
 if (!wedding.submissionUrl) { await new Promise(r => setTimeout(r, 650)); return {demo:true}; }
 const response = await fetch(wedding.submissionUrl, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({kind,...payload})});
 if (!response.ok) throw new Error('Dërgimi nuk u krye. Ju lutemi provoni përsëri.');
 const data = await response.json();
 if(data.stored !== true) throw new Error('Ruajtja nuk u konfirmua. Ju lutemi provoni përsëri.');
 return {demo:false};
}
const stamp=(date:string)=>new Date(date).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
const escapeICS=(s:string)=>s.replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
export function calendar() {
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Melsiana Amarildo//Wedding//SQ','CALSCALE:GREGORIAN','METHOD:PUBLISH','BEGIN:VEVENT','UID:melsiana-amarildo-20261226@invitation.local',`DTSTAMP:${stamp(new Date().toISOString())}`,`DTSTART:${stamp(wedding.date)}`,`DTEND:${stamp(wedding.endDate)}`,`SUMMARY:${escapeICS(wedding.names.join(' & ')+' — Dasma')}`,`LOCATION:${escapeICS(wedding.venue.name+', '+wedding.venue.address)}`,'END:VEVENT','END:VCALENDAR'];
 const url=URL.createObjectURL(new Blob([lines.join('\r\n')+'\r\n'],{type:'text/calendar;charset=utf-8'})); const a=document.createElement('a');a.href=url;a.download='Melsiana-Amarildo.ics';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
