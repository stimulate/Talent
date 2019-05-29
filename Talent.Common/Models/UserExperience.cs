using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text;
using Talent.Common.Contracts;

namespace Talent.Common.Models
{
    [BsonIgnoreExtraElements]
    public class UserExperience : IMongoCommon
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public String Id { get; set; }
        public String Company { get; set; }
        public String Position { get; set; }
        public String Responsibilities { get; set; }
        public String Start { get; set; }
        public String End { get; set; }
        public bool IsDeleted { get; set; }
    }
}
