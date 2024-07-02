using System.Drawing;
using System;

namespace ToDoAPIwithDAPPER.Models
{
    public class DataStore
    {
        private DataStore() { }
        private static DataStore Instance = null;
        private static object obj = new object();

        public string filterBy {  get; set; }
        public string sortBy {  get; set; }
        public string searchBy { get; set; }
       
        public static DataStore GetInstance()
        {
            lock (obj)
            {
                if (Instance == null)
                {
                    Instance = new DataStore();
                }

                return Instance;
            }
        }
    }
}
