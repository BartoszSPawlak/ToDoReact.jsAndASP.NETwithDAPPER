using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using ToDoAPIwithDAPPER.Models;
using Dapper;
using Microsoft.Data.SqlClient;
using System.Globalization;

namespace ToDoAPIwithDAPPER.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ToDoController : ControllerBase
    {
        private static List<Item> Items = new List<Item>() { };
        private readonly ILogger<ToDoController> _logger;
        private SqlConnection connection;
        private string SqlSelectAll;
        DataStore dataStore;
        public ToDoController(ILogger<ToDoController> logger)
        {
            _logger = logger;
            connection = new SqlConnection(@"Server=DESKTOP-RELT69P;Database=ToDoApp;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true");
            SqlSelectAll = "SELECT Id, Name, IsDone FROM Items";
            dataStore = DataStore.GetInstance();
        }

        [EnableCors("Policy")]
        [HttpGet]
        public List<Item> Get()
        {
            var result = connection.Query<Item>(SqlSelectAll).ToList();
            return result;
        }

        [EnableCors("Policy")]
        [HttpPost]
        public List<Item> Post(JsonElement newItem)
        {
            Item item = JsonSerializer.Deserialize<Item>(newItem);

            var parameter = new { name = item.Name };

            var sql = $"INSERT INTO Items(Name, IsDone) VALUES(@name, 0)";
            connection.Query<Item>(sql, parameter);

            var parameters = new { filterBy = dataStore.filterBy, searchBy = '%' + dataStore.searchBy + '%' };

            sql = SelectAllWitchSearchSortFilter();
            var results = connection.Query<Item>(sql, parameters).ToList();

            return results;
        }

        [EnableCors("Policy")]
        [HttpPost("Sort")]
        public List<Item> SortingPost(JsonElement sortByJson)
        {
            var sortBy = JsonSerializer.Deserialize<string>(sortByJson);
            var search = '%' + dataStore.searchBy + '%';
            var parameters = new { searchBy = search, filterBy = dataStore.filterBy, sortBy = sortBy };
            var sql = SqlSelectAll;
            var whereOrAnd = "WHERE";
            if (dataStore.searchBy!=null) {
                sql = sql + $" WHERE Name LIKE @searchBy";
                whereOrAnd = "AND";
            }

            if(dataStore.filterBy != null) { sql = sql + $" {whereOrAnd} IsDone=@filterBy"; }

            if (sortBy != "") {sql = sql + $" ORDER BY Name {sortBy}";}
            dataStore.sortBy = sortBy;
            var results = connection.Query<Item>(sql, parameters).ToList();

            return results;
        }

        [EnableCors("Policy")]
        [HttpPost("Search")]
        public List<Item> SearchingPost(JsonElement searchJson)
        {
            var searchBy = JsonSerializer.Deserialize<string>(searchJson);
            dataStore.searchBy = searchBy;
            searchBy = '%' + searchBy + '%';
            var parameters = new { searchBy = searchBy, filterBy = dataStore.filterBy, sortBy = dataStore.sortBy };
            
            var sql = SqlSelectAll + $" WHERE Name like @searchBy";

            if (dataStore.filterBy != null) { sql = sql + $" AND IsDone=@filterBy"; }
            if (dataStore.sortBy != null) { sql = sql + $" ORDER BY Name {dataStore.sortBy}"; }

            var results = connection.Query<Item>(sql, parameters).ToList();

            return results;
        }

        [EnableCors("Policy")]
        [HttpPost("Filter")]
        public List<Item> FilteringPost(JsonElement searchJson)
        {
            var filterBy = JsonSerializer.Deserialize<string>(searchJson);
            var parameters = new { filterBy = filterBy, searchBy = '%' + dataStore.searchBy + '%' };

            var whereOrAnd = "WHERE";
            var sql = SqlSelectAll;
            if (filterBy == "all")
                dataStore.filterBy = null;
            else
            {
                dataStore.filterBy = filterBy;
                sql = sql + $" WHERE IsDone=@filterBy";
                whereOrAnd = "AND";
            }
           

            if (dataStore.searchBy != null) { sql = sql + $" {whereOrAnd} Name LIKE @searchBy"; }
            if (dataStore.sortBy != null) { sql = sql + $" ORDER BY Name {dataStore.sortBy}"; }

            var results = connection.Query<Item>(sql, parameters).ToList();

            return results;
        }

        public string SelectAllWitchSearchSortFilter()
        {
            var whereOrAnd = "WHERE";
            var sql = SqlSelectAll;
  
            if (dataStore.filterBy != null) { sql = sql + $" WHERE IsDone=@filterBy"; whereOrAnd = "AND"; }
            if (dataStore.searchBy != null) { sql = sql + $" {whereOrAnd} Name LIKE @searchBy"; }
            if (dataStore.sortBy != null) { sql = sql + $" ORDER BY Name {dataStore.sortBy}"; }

            return sql;
        }

        [EnableCors("Policy")]
        [HttpPatch]
        public List<Item> Patch(JsonElement idOfItemToPatchJson)
        {
            var idAndIsDoneOfItemToPatch = JsonSerializer.Deserialize<int>(idOfItemToPatchJson);

            var sql = $"UPDATE Items SET IsDone=1 WHERE Id={idAndIsDoneOfItemToPatch}";
            connection.Query<Item>(sql);

            var parameters = new { filterBy = dataStore.filterBy, searchBy = '%' + dataStore.searchBy + '%' };

            sql = SelectAllWitchSearchSortFilter();
            var results = connection.Query<Item>(sql, parameters).ToList();

            return results;
        }

        [EnableCors("Policy")]
        [HttpDelete]
        public List<Item> Delete(JsonElement idOfItemToPatchJson)
        {
            var idOfItemToPatch = JsonSerializer.Deserialize<int>(idOfItemToPatchJson);

            var sql = $"DELETE FROM Items WHERE Id={idOfItemToPatch}";
            connection.Query<Item>(sql);

            var parameters = new { filterBy = dataStore.filterBy, searchBy = '%' + dataStore.searchBy + '%' };

            sql = SelectAllWitchSearchSortFilter();
            var results = connection.Query<Item>(sql, parameters).ToList();

            return results;
        }
    }
}
