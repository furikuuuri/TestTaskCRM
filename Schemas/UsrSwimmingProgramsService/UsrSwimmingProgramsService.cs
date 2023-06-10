 namespace Terrasoft.Configuration.UsrSwimmingProgramsService
{
    using System;
    using System.IO;
    using System.ServiceModel;
    using System.ServiceModel.Web;
    using System.ServiceModel.Activation;
    using System.Collections.Generic;
    using Terrasoft.Core;
    using Terrasoft.Web.Common;
    using Terrasoft.Core.Entities;
    using System.Globalization;
    using System.Linq;

    [ServiceContract]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
    public class UsrSwimmingProgramsService : BaseService
    {
        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest,
         RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        public int GetSumDurationByCode(string code)
        {
            var swimmingProgram = GetSwimmingProgramByCode(code);
            if(swimmingProgram == null)
            {
                return -1;
            }
            var swimmingLessons = GetLessonsByProgramId(swimmingProgram.PrimaryColumnValue);
            return swimmingLessons.Sum(p => p.GetTypedColumnValue<int>("UsrDuration"));
        }
        private Entity GetSwimmingProgramByCode(string code)
        {
            var esq = new EntitySchemaQuery(UserConnection.EntitySchemaManager, "UsrSwimmingPrograms");
            esq.AddColumn("UsrCode");
            esq.PrimaryQueryColumn.IsAlwaysSelect = true;
            esq.Filters.Add(esq.CreateFilterWithParameters(FilterComparisonType.Equal, "UsrCode", code));
            return esq.GetEntityCollection(UserConnection).FirstOrDefault();
        }
        private EntityCollection GetLessonsByProgramId(Guid programId)
        {
            var esq = new EntitySchemaQuery(UserConnection.EntitySchemaManager, "UsrSwimmingLessons");
            esq.AddColumn("UsrDuration");
            esq.Filters.Add(esq.CreateFilterWithParameters(FilterComparisonType.Equal, "UsrSwimmingProgram", programId));
            return esq.GetEntityCollection(UserConnection);
        }
    }
}