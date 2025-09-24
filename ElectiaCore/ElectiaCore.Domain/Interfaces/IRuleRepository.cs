using ElectiaCore.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ElectiaCore.Domain.Interfaces
{
    public interface IRuleRepository
    {
        Task<Rule> GetRuleAsync(int id);
        Task<IEnumerable<Rule>> GetAllRulesAsync();
        Task AddRuleAsync(Rule rule);
        Task UpdateRuleAsync(Rule rule);
        Task DeleteRuleAsync(int id);
    }
}
