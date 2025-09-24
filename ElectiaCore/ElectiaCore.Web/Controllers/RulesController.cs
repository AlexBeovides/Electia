using ElectiaCore.Application.Interfaces;
using ElectiaCore.Application.DTOs;
using ElectiaCore.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ElectiaCore.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RulesController : ControllerBase
    {
        private readonly IRuleService _ruleService;

        public RulesController(IRuleService ruleService)
        {
            _ruleService = ruleService;
        }        
        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Rule>>> GetRules()
        {
            return Ok(await _ruleService.GetAllRulesAsync());
        }

        [HttpGet("ByCourseInstance/{courseInstanceId}")]
        public async Task<ActionResult<IEnumerable<RuleDto>>> GetRulesByCourseInstance(int courseInstanceId)
        {
            var rules = await _ruleService.GetRulesByCourseInstanceAsync(courseInstanceId);
            return Ok(rules);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Rule>> GetRule(int id)
        {
            var rule = await _ruleService.GetRuleAsync(id);

            if (rule == null)
            {
                return NotFound();
            }

            return rule;
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRule(int id, Rule rule)
        {
            if (id != rule.Id)
            {
                return BadRequest();
            }

            await _ruleService.UpdateRuleAsync(rule);

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Rule>> PostRule([FromBody] CreateRuleDto ruleDto)
        {
            await _ruleService.AddRuleAsync(ruleDto);

            return Ok();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRule(int id)
        {
            await _ruleService.DeleteRuleAsync(id);

            return NoContent();
        }
    }
}
