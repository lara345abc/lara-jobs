import{b as r,c as a}from"./index-CVcFn3UJ.js";const c=async()=>{try{return(await r.get(`${a}/api/placement-test/test/test-links`)).data.data}catch(e){throw console.error("Error fetching placement tests:",e),e}},i=async(e,s)=>{try{const t=!s;return await r.put(`${a}/api/placement-test/test/test-link/link-status`,{test_id:e,is_Active:t}),t}catch(t){throw console.error("Error toggling link status:",t),t}},d=async(e,s)=>{try{await r.post(`${a}/api/placement-test/updateNumberOfQuestions`,{test_id:e,number_of_questions:s})}catch(t){throw console.error("Error updating number of questions:",t),t}},p=async(e,s)=>{try{await r.put(`${a}/api/placement-test/test/test-link/test-monitor-status`,{test_id:e,is_Monitored:s})}catch(t){throw console.error("Error updating monitored status:",t),t}},u=async e=>{try{const t={headers:{Authorization:`Bearer ${localStorage.getItem("token")}`,"Content-Type":"application/json"}};return(await r.post(`${a}/api/placement-test/test/test-results/isCandidateAttended`,{placement_test_id:e},t)).data.hasAttended}catch(s){throw console.error("Error updating monitored status:",s),s}};export{d as a,c as g,u as h,i as t,p as u};
