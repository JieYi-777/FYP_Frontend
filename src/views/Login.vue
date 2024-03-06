axios1.post('/auth/login', {
          //"identifier": "Lim Jie Yi",
          "identifier": "limjieyi@gmail.com",
          "password": "12345678",
          "isEmail": "true"
      }).then(response => {
        const data = response.data;
        
        // Dispatch the login action to update the token in Vuex
        store.dispatch('login', data.token);
        toast.add({ severity: 'success', summary: 'Success', detail: data.message, life: 3000 });
      }).catch(error => {
        if(error.response){

          const status = error.response.status;
          const data = error.response.data;

          if(status === 401 || status === 404){
            toast.add({ severity: 'warn', summary: 'Warning', detail: data.message, life: 3000 });
          }
          else if(status === 500){
            toast.add({ severity: 'warn', summary: 'Warning', detail: data.message, life: 3000 });
          }
          else{
            console.error('Error occurred:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while logging in', life: 3000 });
          }
        }
        else{
          console.error('Error occurred:', error);
        }
      });