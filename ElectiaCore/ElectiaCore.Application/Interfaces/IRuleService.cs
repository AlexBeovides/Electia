using ElectiaCore.Application.DTOs;
using ElectiaCore.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ElectiaCore.Application.Interfaces
{
    public interface IRuleService
    {
        Task<Rule> GetRuleAsync(int id);
        Task<IEnumerable<Rule>> GetAllRulesAsync();
        Task<IEnumerable<RuleDto>> GetRulesByCourseInstanceAsync(int courseInstanceId);
        Task AddRuleAsync(CreateRuleDto rule);
        Task UpdateRuleAsync(Rule rule);
        Task DeleteRuleAsync(int id);
    }
}
